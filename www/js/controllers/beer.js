angular.module('beeround.beer', [])
  .controller('listCtrl', function($scope, beerService, $http, $cordovaGeolocation) {

    $scope.place = undefined;

    $scope.autocompleteOptions = {
      componentRestrictions: { country: 'de' },
      types: ['geocode']
    };

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.lat  = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        $http.get('http://nominatim.openstreetmap.org/reverse?lat='+$scope.lat+'&lon='+$scope.lng+'&format=json').then(result => {
          $scope.location = result.data.address;

          beerService.getBrewerysNearCoordinates(position.coords.latitude, position.coords.longitude, 50).then(result => {
            $scope.breweries = result.data;
          });
        })
      }, function(err) {
        $scope.connectionError = true;
        //TODO ERROR: NO INTERNET; NO GPS OR ELSE
      });


    // ON LOCATION CHANGE
    $scope.$on('g-places-autocomplete:select', function(event, place) {
      console.log(place);
      const location = JSON.parse(JSON.stringify(place.geometry.location));
      beerService.getBrewerysNearCoordinates(location.lat,location.lng, 50).then(result => {
        $scope.breweries = result.data;
        $scope.location = {
          town : place.formatted_address
        }
      });
    });



  });

