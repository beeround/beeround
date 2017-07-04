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

.controller('AppCtrl', function(trophyService, $rootScope, $scope, $ionicModal, $timeout, $state, $ionicUser, $cordovaLocalNotification, $ionicPopup, $cordovaVibration, breweryDB) {
  //$cordovaGoogleAnalytics.trackView('Home Screen');

  $scope.today = new Date().toISOString();

  $scope.searchForm = [];

  $ionicModal.fromTemplateUrl('search.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showBeerSearch = function () {
    $scope.modal.show();
  };

  $scope.search = function () {

    if($scope.searchForm.query && $scope.searchForm.query.length > 3 )
    breweryDB.search($scope.searchForm.query).then(results => {
      $scope.searchResults = results;
      console.log(results);
    })
  };

  // GET CURRENT STATE
  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      $scope.current = toState.url;

    }
  );




  // Trophy PopUp
  $rootScope.newTrophy = function(img, rank, step, type) {

    trophyService.getDescription(type,rank-1).then(trophy => {

      //step + type,
      $timeout(function () {
        $ionicPopup.show({
          template: '<div class="trophyContainer">' +
          '<img src="'+trophy.img+'"/>' +
          '<span>'+trophy.rank+'</span>' +
          '</div>',
          title: "Neue Trophäe erhalten!",
          subTitle: trophy.description+"",
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

    })
  };




});
