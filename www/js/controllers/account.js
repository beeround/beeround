angular.module('beeround.account', [])

  .directive("fileread", [
    function () {
      return {
        scope: {
          fileread: "="
        },
        link: function (scope, element, attributes) {
          element.bind("change", function (changeEvent) {
            let reader = new FileReader();
            reader.onload = function (loadEvent) {
              scope.$apply(function () {
                scope.fileread = loadEvent.target.result;
              });
            };
            reader.readAsDataURL(changeEvent.target.files[0]);
            console.log(changeEvent.target.files[0]);
          });
        }
      }
    }
  ])

  .controller('signUpCtrl', function ($timeout, $cordovaFileTransfer, beeroundService, $cordovaCamera, $scope, $http, $ionicAuth, $state, $stateParams, $ionicUser, $ionicPopup, $ionicActionSheet) {


    $scope.form = [];
    // Triggered on a button click, or some other target
    $scope.showOptions = function () {

      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          {text: 'Kamera'},
          {text: 'Galerie'}
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.startCamera()
          }
          if (index == 1) {
            $scope.showLibrary();
          }
          return true;
        }
      });

    };


    $scope.showLibrary = function () {
      let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {

        $timeout(function () {
          $scope.srcImage = imageURI;

          // Image Upload
          beeroundService.uploadImage(imageURI).then(imageURL => {
            $scope.image = imageURL;

          }, err => {
            let alertPopup = $ionicPopup.alert({
              title: 'Upload fehlgeschlagen! Bitte überprüfe deine Einstellungen und probiere es nochmal!',
            });

          }, 500);

        }, function (err) {

          let alertPopup = $ionicPopup.alert({
            title: 'Es wurde kein Foto ausgewählt',
          });
        });

      })
    };

    $scope.startCamera = function () {
      let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {

        $timeout(function () {
          $scope.srcImage = imageURI;

          // Image Upload
          beeroundService.uploadImage(imageURI).then(imageURL => {
            $scope.image = imageURL;

          }, err => {
            let alertPopup = $ionicPopup.alert({
              title: 'Upload fehlgeschlagen! Bitte überprüfe deine Einstellungen und probiere es nochmal!',
            });

          });

        }, function (err) {

          let alertPopup = $ionicPopup.alert({
            title: 'Du hast den Zugriff verweigert! Es wurde kein Foto gemacht',
          });
        });
      })
    };

    $scope.signup = function () {

      let details = {
        'image': $scope.image,
        'username': $scope.form.username,
        'email': $scope.form.email,
        'password': $scope.form.password
      };

      $ionicAuth.signup(details).then(function () {

        let alertPopup = $ionicPopup.alert({
          title: 'Deine Registrierung war erfolgreich!',
        });
        alertPopup.then(function (res) {

          $state.go("tabs.login");
        });

        // `$ionicUser` is now registered
      }, function (err) {
        for (let e of err.details) {
          if (e === 'conflict_username') {
            var alertPopup = $ionicPopup.alert({
              title: 'Benutzername überprüfen',
              template: 'Benutzername existiert bereits.'
            });
          }
          else if (e === 'conflict_email') {
            var alertPopup = $ionicPopup.alert({
              title: 'E-Mail Adresse überprüfen',
              template: 'E-Mail Adresse existiert bereits.'
            });
          }
          else if (e === 'required_email') {
            var alertPopup = $ionicPopup.alert({
              title: 'Eingabe E-Mail Adresse',
              template: 'Bitte gebe eine E-Mail Adresse ein.'
            });
          }
          else if (e === 'invalid_email') {
            var alertPopup = $ionicPopup.alert({
              title: 'E-Mail Adresse überprüfen',
              template: 'Bitte überprüfe deine E-Mail Adresse.'
            });
          }

          else if (e === 'required_password') {
            var alertPopup = $ionicPopup.alert({
              title: 'Fehlendes Passwort',
              template: 'Bitte wähle ein Passwort.'
            });
          }


          else {

            var alertPopup = $ionicPopup.alert({
              title: 'Login fehlgeschlagen!',
              template: 'Bitte überprüfe deine Eingaben!'
            });
            // handle other errors
          }
        }
      });
    }


  })

  .controller('loginCtrl', function ($rootScope, beeroundService, $scope, $http, $ionicAuth, $ionicUser, $state, $ionicPopup, $stateParams) {
    $scope.form = [];


    $scope.login = function () {
      let details = {'email': $scope.form.email, 'password': $scope.form.password};


      $ionicAuth.login('basic', details).then(function () {

        beeroundService.postLogin($ionicUser.id).then(function () {

          //SUCCESS
          $state.go("tabs.profile");
        })

      }, function (err) {
        let alertPopup = $ionicPopup.alert({
          title: 'Login fehlgeschlagen!',
          template: 'Bitte überprüfe deine Eingaben!'
        });

        //console.log(err);
      });

    }
  })

  .controller('profilCtrl', function ($rootScope, $location, $scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, $cordovaFileTransfer, beeroundService, $cordovaCamera, $ionicActionSheet, trophyService) {
    $scope.userdata = $ionicUser.details;

    // INIT
    $scope.userActivities = {
      beercount : 0,
      ratingcount : 0,
    };
    $scope.trophies = 0;
    $scope.rankTitle = "-";

    beeroundService.getUserActivities($ionicUser.id).then(result => {

      $scope.userActivities = result;
      console.log(result);

      if(result.beercount == undefined){
        $scope.userActivities.beercount = 0;
      }

      if(result.ratingcount == undefined){
        $scope.userActivities.ratingcount = 0;
      }

      if(result.logincount == 1 && !$rootScope.once && result.appstartcount < 1 ){
        $rootScope.once = true;
        $rootScope.newTrophy('img/icon_trophies/baby.png', 1, 1, 'appstart');
      }

    });

    trophyService.getTrophies($ionicUser.id).then(result => {

      $scope.trophies = result[0].appstart+result[0].rating+result[0].event+result[0].differentbeers+result[0].contact+result[0].comment+result[0].characteristics+result[0].beer;
      if($scope.trophies >0){
        $scope.rankTitle = "Bier Baby";
        if($scope.trophies >4){
          $scope.rankTitle = "Bier Beginner";
          if($scope.trophies >9){
            $scope.rankTitle = "Bier Buddy";
            if($scope.trophies >14){
              $scope.rankTitle = "Bier König";
              if($scope.trophies >19){
                $scope.rankTitle = "Biersommelier";
              }
            }
          }
        }
      }
    }, err => {
    });

    $scope.editform = [];

    $scope.editProfile = function () {

      if ($scope.editform.email !== undefined) {
        if ($scope.editform.email.length !== 0) {
          $ionicUser.details.email = $scope.editform.email;
          $ionicUser.save();
          console.log('Email geändert!');

          $state.go("tabs.profile");

        }
      }
      if ($scope.editform.password !== undefined) {
        if ($scope.editform.password.length !== 0) {
          $ionicUser.details.password = $scope.editform.password;
          $ionicUser.save();
          console.log('Passwort geändert!');

          $state.go("tabs.profile");

        }
      }
    };

    $scope.showOptions = function () {

      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          {text: 'Kamera'},
          {text: 'Galerie'}
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.startCamera()
          }
          if (index == 1) {
            $scope.showLibrary();
          }
          return true;
        }
      });

    };

    $scope.goToMyBeers = function () {
      $state.go('tabs.myBeers');
    };

    $scope.goToMyBeerStory = function () {
      $state.go('tabs.myBeerStory');
    };

    $scope.goToStatistics = function () {
      $state.go('tabs.statistics');
    };

    $scope.goToTrophies = function () {
      $state.go('tabs.trophies');
    };

    $scope.showLibrary = function () {
      let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {

        $scope.srcImage = imageURI;

        //Image Upload
        beeroundService.uploadImage(imageURI).then(imageURL => {
          let alertPopup = $ionicPopup.alert({
            title: 'Erfolgreich hochgeladen',
          });

          let data = {
            userid: $ionicUser.id,
            url: imageURL
          };

          $http.delete('http://www.beeround.de/api/changeuserimage/0');

          $timeout(function () {
            $http.post('http://www.beeround.de/api/changeuserimage', data);

          }, 1000);

          $timeout(function () {
            $ionicUser.details.image = imageURL;
            $ionicUser.save();
            $scope.image = imageURL;
          }, 500);


        }, err => {
          let alertPopup = $ionicPopup.alert({
            title: 'Upload fehlgeschlagen! Bitte überprüfe deine Einstellungen und probiere es nochmal!',
          });

        });

      }, function (err) {

        let alertPopup = $ionicPopup.alert({
          title: 'Es wurde kein Foto ausgewählt',
        });
      });
    };

    $scope.startCamera = function () {
      let options = {
        quality: 70,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {

        $scope.srcImage = imageURI;

        //Image Upload
        beeroundService.uploadImage(imageURI).then(imageURL => {

          alert("Erfolgreich hochgeladen");
          let data = {
            userid: $ionicUser.id,
            url: imageURL
          };

          $http.delete('http://www.beeround.de/api/changeuserimage/0');

          $timeout(function () {
            $http.post('http://www.beeround.de/api/changeuserimage', data);
          }, 1000);

          $timeout(function () {
            $ionicUser.details.image = imageURL;
            $ionicUser.save();
            $scope.image = imageURL;
          }, 500);


        }, err => {
          let alertPopup = $ionicPopup.alert({
            title: 'Upload fehlgeschlagen! Bitte überprüfe deine Einstellungen und probiere es nochmal!',
          });

        });

      }, function (err) {

        let alertPopup = $ionicPopup.alert({
          title: 'Du hast den Zugriff verweigert! Es wurde kein Foto gemacht',
        });
      });
    };

    $scope.deleteUser = function () {

      let confirmPopup = $ionicPopup.confirm({
        title: 'Konto löschen',
        template: 'Bist du dir sicher, dass du dein Konto löschen willst?',
        okText: 'Ja',
        cancelText: 'Abbrechen'
      });

      confirmPopup.then(function (res) {
        if (res) {
          console.log($ionicUser.id);
          $ionicUser.delete();
          let alertPopup = $ionicPopup.alert({
            title: 'Erfolgreich!',
            template: "Dein Konto mit dem Namen " + $scope.userdata.username + " wurde gelöscht.",
          });
          alertPopup.then(function (res) {
            $ionicAuth.logout();
            $state.go('tabs.login')
          });
        } else {

        }
      });

    };

    $scope.logout = function () {
      let confirmPopup = $ionicPopup.confirm({
        title: 'Ausloggen',
        template: 'Willst du wirklich ausgeloggt werden?',
        okText: 'Ok',
        cancelText: 'Abbrechen'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $state.go('tabs.login');
          $ionicAuth.logout();
          $ionicPopup.alert({
            title: 'Du hast dich erfolgreich ausgeloggt!'
          });

        }
      });
    };

  })

  .controller('myBeersCtrl', function ($rootScope, $scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet) {

    beeroundService.getBeerCounts($ionicUser.id).then(result => {
      $scope.beerList = result;
    });


    $scope.logBeer = function (beerId, breweryname, beername) {


      let data = {
        beerid: beerId,
        userid: $ionicUser.id,
        latitude: $rootScope.userSettings.lat,
        longitude: $rootScope.userSettings.lng,
        breweryname: breweryname,
        beername: beername

      };

      beeroundService.logBeer(data).then(function () {
        // SUCCESS

        beeroundService.getBeerCounts($ionicUser.id).then(result => {
          $scope.beerList = result;
          $rootScope.isLocked = true;

          // Timeout against trolling
          $timeout(function () {
            $rootScope.isLocked = false;
          }, 100000);
        });


      }, function () {
        // Failed
        let alertPopup = $ionicPopup.alert({
          title: 'Es ist ein Problem aufgetreten.',
          template: 'Bitte überprüfe deine Internetverbindung und versuche es erneut.',
        });
      });

    };
  })

  .controller('myBeerStoryCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet) {

    beeroundService.getBeerStory($ionicUser.id).then(result => {

      $scope.userBeerStory = result;

    }, err => {
      $scope.userBeerStory = [];

      // Failed
      let alertPopup = $ionicPopup.alert({
        title: 'Es ist ein Problem aufgetreten.',
        template: 'Bitte überprüfe deine Internetverbindung und versuche es erneut.',
      });
    })

  })

  .controller('myStatisticsCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService) {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();

    function getMonthString(monthNumber) {
      let MonthString = "";
      switch (monthNumber) {
        case 0:
          MonthString = "Jan";
          break;
        case 1:
          MonthString = "Feb";
          break;
        case 2:
          MonthString = "Mär";
          break;
        case 3:
          MonthString = "Apr";
          break;
        case 4:
          MonthString = "Mai";
          break;
        case 5:
          MonthString = "Jun";
          break;
        case 6:
          MonthString = "Jul";
          break;
        case 7:
        case -5:
          MonthString = "Aug";
          break;
        case 8:
        case -4:
          MonthString = "Sep";
          break;
        case 9:
        case -3:
          MonthString = "Okt";
          break;
        case 10:
        case -2:
          MonthString = "Nov";
          break;
        case 11:
        case -1:
          MonthString = "Dez";
          break;
      }
      return MonthString;
    }

    let statisticData = [];

    beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 5).then(function (result) {
      statisticData.push(result);
      beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 4).then(function (result) {
        statisticData.push(result);
        beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 3).then(function (result) {
          statisticData.push(result);
          beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 2).then(function (result) {
            statisticData.push(result);
            beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 1).then(function (result) {
              statisticData.push(result);
              beeroundService.getBeerDataByMonth($ionicUser.id, currentDate, 0).then(function (result) {
                statisticData.push(result);
              });
            });
          });
        });
      });
    });


    $scope.labels = [getMonthString((currentMonth - 5)), getMonthString((currentMonth - 4)), getMonthString((currentMonth - 3)), getMonthString((currentMonth - 2)), getMonthString((currentMonth - 1)), getMonthString(currentMonth)];
    $scope.series = ['Biere'];

    $scope.data = [
      statisticData,
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{
      borderColor: '#773D17',
      pointRadius: 7,
      pointHitRadius: 10,
      pointHoverRadius: 10,
      backgroundColor: '#F2F0CE',
      pointBackgroundColor: '#F1A435',
      pointHoverBackgroundColor: '#F1A435'
    }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              beginAtZero: true
            }
          },

        ]
      }
    };

    beeroundService.getUserActivities($ionicUser.id).then(result => {

      $scope.userActivities = result;

      if(result.beercount == undefined) {

        $scope.userActivities.beercount = 0;
        $scope.userActivities.differentbeerscount = 0;

      }

      if(result.commentcount == undefined){
        $scope.userActivities.commentcount = 0;

      }


    }, err => {
      // Failed
      let alertPopup = $ionicPopup.alert({
        title: 'Es ist ein Problem aufgetreten.',
        template: 'Bitte überprüfe deine Internetverbindung und versuche es erneut.',
      });
    });


  })

  .controller('myTrophiesCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet, trophyService) {

    trophyService.getTrophies($ionicUser.id).then(result => {
      $scope.allTrophys = result;
      }, err => {
    });

      // Handle PopOver Filter
      $ionicPopover.fromTemplateUrl('trophies.html', {
          scope: $scope
      }).then(function (popover) {
          $scope.popover = popover;
      });

      $scope.openPopover = function (type, rang) {
        trophyService.getDescription(type,rang).then(result => {
          $scope.currentTrophy = result;
        });

          $scope.popover.show();
          $scope.appBackground = document.getElementsByClassName('appBackground');
          $scope.appBackground[0].setAttribute('class', 'view blur');
      };
      $scope.closePopover = function () {
          $scope.popover.hide();
          $scope.appBackground = document.getElementsByClassName('blur');
          $scope.appBackground[0].setAttribute('class', 'view appBackground');
      };

  })

;








