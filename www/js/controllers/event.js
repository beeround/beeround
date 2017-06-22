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
        if($ionicUser.id){
          beeroundService.postContact($ionicUser.id);
        }
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

        // Log activity
        if($ionicUser.id){
          beeroundService.postContact($ionicUser.id);
        }

          window.open("tel://"+formattedNumber, '_system', 'location=yes');
      };

      // Navigate to location
      $scope.navigateGoogleMaps = function (street, streetnumber, postal_code) {

          console.log(street, streetnumber, postal_code);
          window.open('https://www.google.com/maps/dir/Current+Location/' + street + streetnumber +', ' + postal_code, '_system');

      };

    //Event for the smartphone calendar
    $scope.createEvent = function () {

      $cordovaCalendar.createEvent({
        title: $scope.event.name,
        location: $scope.event.city,
        notes: $scope.event.description,
        startDate: new Date(($filter('date')($scope.event.start, 'medium', '+0200'))),
        endDate: new Date(($filter('date')($scope.event.end, 'medium', '+0200')))
      }).then(function (result) {

        // Log activity
        if($ionicUser.id){
          beeroundService.postEvent($ionicUser.id);
        }

          let alertPopup = $ionicPopup.alert({
              title: 'Prost!',
              description: 'Event wurde zum Kalender hinzugefügt!'
          });


      }, function (err) {
          let alertPopup = $ionicPopup.alert({
              title: 'Hinzufügen fehlgeschlagen',
              description: 'Event wurde zum Kalender hinzugefügt!'
          });
      })
    }
  });





