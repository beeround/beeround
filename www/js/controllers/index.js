angular.module('beeround.index', [])
  .controller('NavCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $timeout) {
    $scope.showMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
      $ionicSideMenuDelegate.toggleRight();
    };

  })
  .controller('HomeTabCtrl', function($scope) {
  })

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicUser) {
  //$cordovaGoogleAnalytics.trackView('Home Screen');


  // GET CURRENT STATE
  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      $scope.current = toState.url;
    }
  )




});
