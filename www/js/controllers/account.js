angular.module('beeround.account', [])

  .controller('signUpCtrl', function ($scope, $http, $ionicAuth, $state, $stateParams, $ionicUser, $ionicPopup) {
    $scope.form = [];
    $scope.signup = function () {
      let details = {'username': $scope.form.username,'email': $scope.form.email, 'password': $scope.form.password };
      console.log(details);
      $ionicAuth.signup(details).then(function() {
        alert("Sign Up");
        $state.go("tabs.login");

        // `$ionicUser` is now registered
      }, function(err) {
        for (let e of err.details) {
        if (e === 'conflict_username'){
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
        else if (e === 'required_email'){
          var alertPopup = $ionicPopup.alert({
            title: 'Eingabe E-Mail Adresse',
            template: 'Bitte gebe eine E-Mail Adresse ein.'
          });
        }
        else if (e === 'invalid_email'){
          var alertPopup = $ionicPopup.alert({
            title: 'E-Mail Adresse überprüfen',
            template: 'Bitte überprüfe deine E-Mail Adresse.'
          });
        }

          else if (e === 'required_password'){
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

  .controller('profilCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $state, $stateParams) {
    $scope.userdata = $ionicUser.details;


    $scope.logout = function () {
      $ionicAuth.logout();
      alert("logged out");
      $state.go('tabs.login')

    };


  });







