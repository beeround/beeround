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

  $scope.today = new Date().toISOString();


  // GET CURRENT STATE
  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      $scope.current = toState.url;

    }
  );




  // Trophy PopUp
  $rootScope.newTrophy = function(img, rank, step, type) {

    //step + type,
    $timeout(function () {
      $ionicPopup.show({
        template: '<div class="trophyContainer">' +
        '<img src="'+img+'"/>' +
        '<span>'+rank+'</span>' +
        '</div>',
        title: "Neue Trophäe erhalten!",
        subTitle: 'Glückwunsch!! Du hast '+step +' '+type+' und bist ein Rang aufgestiegen! ',
        scope: $scope,
        cssClass: 'newTrophy',
        buttons: [
          { text: 'Ok' },
        ]
      });

      $cordovaVibration.vibrate(1000);

      let now = new Date().getTime();

      let twenty = new Date(now + 1200000);

      $cordovaLocalNotification.schedule({
        id: 1,
        title: "Keep going!!",
        text: "Du hast vor kurzem eine Trophäe erhalten. Weiter so!!",
        at: twenty
      })
    },5000)

  };




});
