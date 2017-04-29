angular.module('beeround.beer', [])
  .controller('listCtrl', function($scope, beerService, $http, $cordovaGeolocation) {

    $scope.place = undefined;

    // INIT radius variable and set to  50
    $scope.radius = 50;

    $scope.lat = undefined;
    $scope.lng = undefined;



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

          beerService.getBrewerysNearCoordinates( $scope.lat, $scope.lng, $scope.radius).then(result => {
            $scope.breweries = result.data;
          });
        })
      }, function(err) {
        $scope.connectionError = true;
        //TODO ERROR: NO INTERNET; NO GPS OR ELSE
      });


    // ON LOCATION CHANGE
    $scope.$on('g-places-autocomplete:select', function(event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));
      $scope.lat = location.lat;
      $scope.lng = location.lng;
      beerService.getBrewerysNearCoordinates($scope.lat, $scope.lng, $scope.radius).then(result => {
        $scope.breweries = result.data;
        $scope.location = {
          town : place.formatted_address
        }
      });
    });

    $scope.showSelectValue = function(radiusSelect) {
      var str = radiusSelect;
      str = radiusSelect.substring(0, str.length - 3);

      // Write new radius in variable
      $scope.radius = str;

      // Reload breweries
      beerService.getBrewerysNearCoordinates($scope.lat, $scope.lng, $scope.radius).then(result => {
        $scope.breweries = result.data;
      });
    }


  });

