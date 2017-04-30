angular.module('beeround.beer', [])
  .controller('breweriesListCtrl', function($scope, beerService, $http, $cordovaGeolocation, $ionicLoading) {

    $scope.place = undefined;

    // INIT radius var and set to  50
    $scope.radius = 50;

    // INIT lat and lng var
    $scope.lat = undefined;
    $scope.lng = undefined;

    // Only show locations in DE
    $scope.autocompleteOptions = {
      componentRestrictions: { country: 'de' },
      types: ['geocode']
    };

    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
    });

    // Don't wait till death
    var posOptions = {timeout: 20000, enableHighAccuracy: false};

    // Geolocation

    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.lat  = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        $http.get('http://nominatim.openstreetmap.org/reverse?lat='+$scope.lat+'&lon='+$scope.lng+'&format=json').then(result => {
          $scope.location = result.data.address;
          getBreweries();

        })
      }, function(err) {
        $scope.connectionError = true;
        //TODO ERROR: NO INTERNET; NO GPS OR ELSE
      });


    // on manual location change
    $scope.$on('g-places-autocomplete:select', function(event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));
      $scope.lat = location.lat;
      $scope.lng = location.lng;
      $scope.location = {
        town : place.formatted_address
      };
      getBreweries();
    });

    // filters
    $scope.showSelectValue = function(radiusSelect) {
      var str = radiusSelect;
      str = radiusSelect.substring(0, str.length - 3);

      // Write new radius in variable
      $scope.radius = str;

      // Reload breweries
      getBreweries();
    };



    // Get breweries function
    function getBreweries() {

      beerService.getBrewerysNearCoordinates($scope.lat, $scope.lng, $scope.radius).then(result => {
        $scope.breweries = result.data;
        $ionicLoading.hide()
      });
      // TODO NO Breweries FOUND
    }


  })
  .controller('beerListCtrl', function($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const breweryId = $stateParams.brewery;
    beerService.getBeersByBrewery(breweryId).then(result => {
      $scope.beerList = result.data;
    })


  });



