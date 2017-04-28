angular.module('beeround.beer', [])
  .controller('listCtrl', function($scope, beerService, $http, $cordovaGeolocation) {

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.lat  = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        $http.get('http://nominatim.openstreetmap.org/reverse?lat='+$scope.lat+'&lon='+$scope.lng+'&format=json').then(result => {
          $scope.location = result.data.address;

          beerService.getBrewerysByPLZ(result.data.address.postcode).then(result => {
            console.log(result);
            $scope.breweries = result.data;
          });
        })
      }, function(err) {
        //TODO ERROR: NO INTERNET; NO GPS OR ELSE
      });


  });

