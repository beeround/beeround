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
        alert("Sign Up");
        $state.go("tabs.login");

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

  .controller('profilCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $ionicPopup, $state, $stateParams, $timeout, $cordovaFileTransfer, beeroundService, $cordovaCamera, $ionicActionSheet) {
    $scope.userdata = $ionicUser.details;


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
      /*if ($scope.editform.image !== undefined){
       if($scope.editform.image.length !== 0 ) {
       $ionicUser.details.username = $scope.editform.image;
       $ionicUser.save();
       console.log('Image geändert');
       }}*/
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
          alert("Dein Konto mit dem Namen "+ $scope.userdata.username + " wurde gelöscht." );
          $ionicAuth.logout();
          $state.go('tabs.login')
        } else {

        }
      });

    };


    //Password Reset Url
    $scope.passwordResetUrl = $ionicAuth.passwordResetUrl;
    console.log($scope.passwordResetUrl);

    $scope.logout = function () {
      $ionicAuth.logout();
      alert("logged out");
      $state.go('tabs.login')
    };


// Handle PopOver
    $ionicPopover.fromTemplateUrl('filter.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function () {
      $scope.popover.show();
      $scope.appBackground = document.getElementsByClassName('appBackground');
      console.log($scope.appBackground[0]);
      $scope.appBackground[0].setAttribute('class', 'blur');
    };


    $scope.closePopover = function () {
      $scope.popover.hide();
      $scope.appBackground = document.getElementsByClassName('blur');
      $scope.appBackground[0].setAttribute('class', 'view appBackground');
    };


  })
;







