angular.module('beeround.event', [])

  .controller('eventDetailsCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser, $stateParams) {

    let id = $stateParams.id;

    beeroundService.getEventDetail(id).then(result => {
      $scope.event = result;
      return result;
    });
  });







