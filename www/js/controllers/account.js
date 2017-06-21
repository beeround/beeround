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
    $scope.showOptions = function() {

      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          { text: 'Kamera' },
          { text: 'Galerie' }
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if(index == 0){
            $scope.startCamera()
          }
          if( index == 1){
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

      $cordovaCamera.getPicture(options).then(function(imageURI) {

        $timeout(function () {
          $scope.srcImage = imageURI;

          // Image Upload
          beeroundService.uploadImage(imageURI).then(imageURL => {
            $scope.image = imageURL;

          }, err => {
            alert("Fehler")
          });

        },500);

      }, function(err) {

        alert(err)
        // error
      });
    };

    $scope.startCamera = function () {
      let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {

        $timeout(function () {
          $scope.srcImage = imageURI;

          // Image Upload
          beeroundService.uploadImage(imageURI).then(imageURL => {
            $scope.image = imageURL;

          }, err => {
            alert("Fehler")
          });

        },500);


      }, function(err) {

        alert(err)
        // error
      });
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
          title: 'Du bist eingeloggt!',
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

  .controller('loginCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $state, $ionicPopup, $stateParams) {
    $scope.form = [];

    $scope.login = function () {
      let details = {'email': $scope.form.email, 'password': $scope.form.password};


      $ionicAuth.login('basic', details).then(function () {
        //SUCCESS
        $state.go("tabs.profile");

      }, function (err) {
        let alertPopup = $ionicPopup.alert({
          title: 'Login fehlgeschlagen!',
          template: 'Bitte überprüfe deine Eingaben!'
        });

        //console.log(err);
      });

    }
  })

  .controller('profilCtrl', function ($location, $scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, $cordovaFileTransfer, beeroundService, $cordovaCamera, $ionicActionSheet) {
    $scope.userdata = $ionicUser.details;


    $scope.editform = [];

    $scope.editProfile = function () {
      console.log($scope.editform);

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

    $scope.showOptions = function() {

      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          { text: 'Kamera' },
          { text: 'Galerie' }
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if(index == 0){
            $scope.startCamera()
          }
          if( index == 1){
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

      $cordovaCamera.getPicture(options).then(function(imageURI) {

        $scope.srcImage = imageURI;

        //Image Upload
        beeroundService.uploadImage(imageURI).then(imageURL => {
          alert("Erfolgreich hochgeladen");

          let data = {
            userid: $ionicUser.id ,
            url: imageURL
          };

          $http.delete('http://www.beeround.de/api/changeuserimage/0');

          $timeout(function () {
            $http.post('http://www.beeround.de/api/changeuserimage', data);

          },1000);

          $timeout(function () {
            $ionicUser.details.image = imageURL;
            $ionicUser.save();
            $scope.image = imageURL;
          },500);


        }, err => {
          alert("Fehler")
        });

      }, function(err) {

        alert(err)
        // error
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

      $cordovaCamera.getPicture(options).then(function(imageURI) {

        $scope.srcImage = imageURI;

        //Image Upload
        beeroundService.uploadImage(imageURI).then(imageURL => {
          alert("Erfolgreich hochgeladen");
          let data = {
            userid: $ionicUser.id ,
            url: imageURL
          };

          $http.delete('http://www.beeround.de/api/changeuserimage/0');

          $timeout(function () {
            $http.post('http://www.beeround.de/api/changeuserimage', data);
          },1000);

          $timeout(function () {
            $ionicUser.details.image = imageURL;
            $ionicUser.save();
            $scope.image = imageURL;
          },500);


        }, err => {
          alert("Fehler")
        });

      }, function(err) {

        alert(err)
        // error
      });
    };


    $scope.deleteUser = function() {

      let confirmPopup = $ionicPopup.confirm({
        title: 'Konto löschen',
        template: 'Bist du dir sicher, dass du dein Konto löschen willst?',
        okText: 'Sicher',
        cancelText: 'Lieber nicht'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log($ionicUser.id);
          $ionicUser.delete();
          let alertPopup = $ionicPopup.alert({
            title: 'Erfolgreich!',
            template: "Dein Konto mit dem Namen "+ $scope.userdata.username + " wurde gelöscht.",
          });
          alertPopup.then(function (res) {
            $ionicAuth.logout();
            $state.go('tabs.login')
          });
        } else {

        }
      });

    };


    //Password Reset Url
    $scope.passwordResetUrl = $ionicAuth.passwordResetUrl;
    console.log($scope.passwordResetUrl);

    $scope.logout = function () {
      $ionicAuth.logout();

      let alertPopup = $ionicPopup.alert({
        title: 'Du wurdest ausgeloggt!'
      });
      alertPopup.then(function (res) {
        $state.go('tabs.login')
      });
    };

  })

  .controller('myBeersCtrl', function ($rootScope, $scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet) {

    beeroundService.getBeerCounts($ionicUser.id).then(result => {
      $scope.beerList = result;
    });

    $scope.logBeer = function(beerId, breweryname, beername) {


      let data = {
        beerid : beerId,
        userid : $ionicUser.id,
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
          },100000);
        });


      }, function () {
        // TODO ERROR HANDLING
        console.log("error");
      });

    };
  })

  .controller('myBeerStoryCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet) {

    beeroundService.getBeerStory($ionicUser.id).then(result => {

      $scope.userBeerStory = result;

    }, err => {
      //TODO ERROR Handling
      console.log(err);
    })

  })

  .controller('myStatisticsCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService){

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    function getMonthString(monthNumber) {
      let MonthString = "";
      switch (monthNumber){
        case 0:
          MonthString = "Januar";
          break;
        case 1:
          MonthString = "Februar";
          break;
        case 2:
          MonthString = "März";
          break;
        case 3:
          MonthString = "April";
          break;
        case 4:
          MonthString = "Mai";
          break;
        case 5:
          MonthString = "Juni";
          break;
        case 6:
          MonthString = "Juli";
          break;
        case 7:
        case -5:
          MonthString = "August";
          break;
        case 8:
        case -4:
          MonthString = "September";
          break;
        case 9:
        case -3:
          MonthString = "Oktober";
          break;
        case 10:
        case -2:
          MonthString = "November";
          break;
        case 11:
        case -1:
          MonthString = "Dezember";
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


    $scope.labels = [ getMonthString((currentMonth -5)), getMonthString((currentMonth -4)), getMonthString((currentMonth -3)), getMonthString((currentMonth -2)), getMonthString((currentMonth -1)), getMonthString(currentMonth)];
    $scope.series = ['Biere'];
    $scope.data = [
      statisticData,
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{borderColor:'#773D17', pointRadius: 7, pointHitRadius: 10, pointHoverRadius: 10, backgroundColor: '#F2F0CE', pointBackgroundColor: '#F1A435', pointHoverBackgroundColor: '#F1A435'}];
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
  })

  .controller('myTrophiesCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, beeroundService, $ionicActionSheet) {

    alert("Tropähen")
  })



;







