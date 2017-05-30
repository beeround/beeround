angular.module('beeround.account', [])

  .controller('signUpCtrl', function ($scope, $http, $ionicAuth, $ionicUser) {
    $scope.form = [];

    $scope.signup = function () {
      let details = {'username': $scope.form.username,'email': $scope.form.email, 'password': $scope.form.password};
      console.log(details);
      $ionicAuth.signup(details).then(function() {
        // `$ionicUser` is now registered
      }, function(err) {
        for (let e of err.details) {
          if (e === 'conflict_email') {
            alert('Email already exists.');
          }
          else if (e === 'conflict_username'){
            alert('Username already exists.')
          }
          else if (e === 'required_password'){
            alert('Please choose a password.')
          }
          else if (e === 'required_email'){
            alert('Please insert your email address.')
          }
          else if (e === 'invalid_email'){
            alert('Please insert your right email address.')
          }

          else {
            // handle other errors
          }
        }
      });
    }
  })

  .controller('loginCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $state, $stateParams) {
    $scope.form = [];

    $scope.login = function () {
      let details = {'email': $scope.form.email, 'password': $scope.form.password};
      console.log(details);

      $ionicAuth.login('basic', details).then(function () {
        //SUCCESS
        console.log($ionicUser);

        $state.go("tabs.profile");
      }, function (err) {
        console.log(err);
      });

    }
  })

  .controller('profilCtrl', function ($scope, $http, $ionicAuth, $ionicUser, $state, $stateParams) {
    $scope.test = $ionicUser.details;



  });







