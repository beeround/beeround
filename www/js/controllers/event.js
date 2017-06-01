angular.module('beeround.event', [])

  .controller('eventDetailsCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser, $stateParams, $filter) {

    let id = $stateParams.id;

    $scope.event = undefined;

    beeroundService.getEventDetail(id).then(result => {
      $scope.event = result;
      console.log($scope.event.start_time);
      console.log($filter('date')(new Date($scope.event.start), 'yyyy'), $filter('date')(new Date($scope.event.start), 'MM'), $filter('date')(new Date($scope.event.start), 'dd'), $filter('date')(new Date($scope.event.start), 'HH'), $filter('date')(new Date($scope.event.start), 'MM'), 0, 0, 0);
      return result;
    });


    $scope.createEvent = function () {
      $cordovaCalendar.createEvent({
        title: $scope.event.name,
        location: $scope.event.city,
        notes: $scope.event.description,
        startDate: new Date(2017, 5, 1, 18, 30, 0, 0, 0),
        endDate: new Date(2017, 5, 1, 19, 30, 0, 0, 0)
      }).then(function (result) {
        alert("PROST!")
      }, function (err) {
        alert("Hinzufügen fehlgeschlagen")
      })
    }
  });

  //startDate: ($filter('date')(new Date($scope.event.start), 'yyyy'), $filter('date')(new Date($scope.event.start), 'MM'), $filter('date')(new Date($scope.event.start), 'dd'), $filter('date')(new Date($scope.event.start), 'HH'), $filter('date')(new Date($scope.event.start), 'MM'), 0, 0, 0),
  //endDate: ($filter('date')(new Date($scope.event.end), 'yyyy'), $filter('date')(new Date($scope.event.end), 'MM'), $filter('date')(new Date($scope.event.end), 'dd'), $filter('date')(new Date($scope.event.end), 'HH'), $filter('date')(new Date($scope.event.end), 'MM'), 0, 0, 0)





