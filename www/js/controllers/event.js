angular.module('beeround.event', [])

  .controller('eventDetailsCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser, $stateParams, $filter, trophyService) {

    let id = $stateParams.id;

    $scope.event = undefined;

    beeroundService.getEventDetail(id).then(result => {
      $scope.event = result;
      return result;
    });

      //Send Mail to Event organizer
      $scope.sendMail = function (mailAdress) {
        if($ionicUser.id){
          beeroundService.postContact($ionicUser.id).then(function(){
            trophyService.checkContactTrophies($ionicUser.id).then(result => {
              if(result != 0){
                let tmpvar = ' Kontaktanfragen';
                if(result.step == 1){
                  tmpvar = ' Kontaktanfrage'
                }
                $rootScope.newTrophy(result.img, result.rank, result.step, 'contact')
              }
            });
          });
        }
        window.open("mailto:"+mailAdress, '_system');
      };


      //FORMAT PHONE NUMBER

      $scope.formatNumber = function (phonenumber) {

          let formattedNumber = phonenumber;
          formattedNumber = formattedNumber.replace(/\s/g, '');
          formattedNumber = formattedNumber.replace(/-/g, '');
          formattedNumber = formattedNumber.replace(/\//g, '');
          formattedNumber = formattedNumber.replace(/\)/g, '');
          formattedNumber = formattedNumber.replace(/\(/g, '');


          if (formattedNumber.substr(0, 2) == "49") {
              formattedNumber = formattedNumber.substr(2);
          }

          else if(formattedNumber.substr(0,1) == "+49"){
              formattedNumber = formattedNumber.replace('+49', '0');
          }

        // Log activity
        if($ionicUser.id){
          beeroundService.postContact($ionicUser.id).then(function(){
            trophyService.checkContactTrophies($ionicUser.id).then(result => {
              if(result != 0){
                let tmpvar = ' Kontaktanfragen';
                if(result.step == 1){
                  tmpvar = ' Kontaktanfrage'
                }
                $rootScope.newTrophy(result.img, result.rank, result.step, 'contact')
              }
            });
          });
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
          beeroundService.postEvent($ionicUser.id).then(function(){
            trophyService.checkEventTrophies($ionicUser.id).then(result => {
              if(result != 0){
                let tmpvar = ' Events vorgemerkt';
                if(result.step == 1){
                  tmpvar = ' Event vorgemerkt'
                }
                $rootScope.newTrophy(result.img, result.rank, result.step, 'event')
              }
            });
          });
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





