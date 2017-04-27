angular.module('beeround.beer', [])
  .controller('listCtrl', function($scope, beerService, $http, $cordovaGeolocation) {

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.lat  = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        $http.get('http://nominatim.openstreetmap.org/reverse?lat='+$scope.lat+'&lon='+$scope.lng+'&format=json').then(result => {
          console.log(result);
          $scope.location = result.data.address;
        })
      }, function(err) {
        //TODO ERROR: NO INTERNET; NO GPS OR ELSE
      });

    beerService.getBeers().then(result => {
      $scope.beerlist = result.data;
    });
  });

