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

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $state, $ionicUser, $cordovaLocalNotification, $ionicPopup, $cordovaVibration) {
  //$cordovaGoogleAnalytics.trackView('Home Screen');


  // GET CURRENT STATE
  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      $scope.current = toState.url;
    }
  );
/* Uncomment on ios build
  $cordovaLocalNotification.schedule({
    id: 2,
    title: "Happy new Beer Year!!",
    text: "Du nutzt Beeround bereits ein Jahr! Trinken wir, auf viele Weitere!!",
    every: 'year'
  });
  */


  // Trophy PopUp
  $rootScope.newTrophy = function(img, rank, step, type) {

    $timeout(function () {
      $ionicPopup.show({
        template: '<img src="'+img+'"/>',
        title: step + type,
        subTitle: 'Glückwunsch!! Rang: '+ rank,
        scope: $scope,
        buttons: [
          { text: 'Ok' },
        ]
      });

      $cordovaVibration.vibrate(500);

      let now = new Date().getTime();

      let twenty = new Date(now + 1200000);

      $cordovaLocalNotification.schedule({
        id: 1,
        title: "Keep going!!",
        text: "Du hast vor kurzem eine Trophäe erhalten. Weiter so!!",
        at: twenty
      })
    },10000)

  };




});
