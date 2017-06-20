angular.module('beeround.event', [])

  .controller('eventDetailsCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser, $stateParams, $filter) {

    let id = $stateParams.id;

    $scope.event = undefined;

    beeroundService.getEventDetail(id).then(result => {
      $scope.event = result;
      return result;
    });

      //Send Mail to Event organizer

      $scope.sendMail = function (mailAdress) {

          window.open("mailto:"+mailAdress, '_self');
      };


      //FORMAT PHONE NUMBER

      $scope.formatNumber = function (phonenumber) {

          let formattedNumber = phonenumber;
          formattedNumber = formattedNumber.replace(/\s/g, '');
          formattedNumber = formattedNumber.replace(/-/g, '');
          formattedNumber = formattedNumber.replace(/\//g, '');
          formattedNumber = formattedNumber.replace(/\)/g, '');
          formattedNumber = formattedNumber.replace(/\(/g, '');

          console.log(formattedNumber);

          if (formattedNumber.substr(0, 2) == "49") {
              formattedNumber = formattedNumber.substr(2);
          }

          else if(formattedNumber.substr(0,1) == "+49"){
              formattedNumber = formattedNumber.replace('+49', '0');
          }
          console.log(formattedNumber);
          window.open("tel://"+formattedNumber, '_system', 'location=yes');
      };

    $scope.createEvent = function () {
      console.log(new Date(($filter('date')($scope.event.start, 'medium', '+0200'))));
        $cordovaCalendar.createEvent({
        title: $scope.event.name,
        location: $scope.event.city,
        notes: $scope.event.description,
        startDate: new Date(($filter('date')($scope.event.start, 'medium', '+0200'))),
        endDate: new Date(($filter('date')($scope.event.end, 'medium', '+0200')))
      }).then(function (result) {
        alert("PROST!")
      }, function (err) {
        alert("Hinzufügen fehlgeschlagen")
      })
    }
  });

  //startDate: ($filter('date')(new Date($scope.event.start), 'yyyy'), $filter('date')(new Date($scope.event.start), 'MM'), $filter('date')(new Date($scope.event.start), 'dd'), $filter('date')(new Date($scope.event.start), 'HH'), $filter('date')(new Date($scope.event.start), 'MM'), 0, 0, 0),
  //endDate: ($filter('date')(new Date($scope.event.end), 'yyyy'), $filter('date')(new Date($scope.event.end), 'MM'), $filter('date')(new Date($scope.event.end), 'dd'), $filter('date')(new Date($scope.event.end), 'HH'), $filter('date')(new Date($scope.event.end), 'MM'), 0, 0, 0)





