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

  .controller('signUpCtrl', function ($scope, $http, $ionicAuth, $state, $stateParams, $ionicUser, $ionicPopup) {

    $scope.uploadme = undefined;

    $scope.uploadImage = function(uploadme) {

      let fd = new FormData();
      let imgBlob = dataURItoBlob(uploadme);
      fd.append('file', imgBlob);

      // $http.post('imageURL', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined
      // }})
      //   .success(function(response) {
      //     console.log('success', response);
      //   })
      //   .error(function(response) {
      //     console.log('error', response);
      //   });
    };


    //you need this function to convert the dataURI
    function dataURItoBlob(dataURI) {
      let binary = atob(dataURI.split(',')[1]);
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: mimeString
      });
    }


    $scope.form = [];
    $scope.signup = function () {
      let details = {
        'image': $scope.image,
        'username': $scope.form.username,
        'email': $scope.form.email,
        'password': $scope.form.password
      };
      console.log(details);
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
      console.log(details);

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

  .controller('profilCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $ionicPopover, $state, $stateParams) {
    $scope.userdata = $ionicUser.details;


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


  });







