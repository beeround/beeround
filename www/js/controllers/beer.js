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

    // Load breweries on start
    getBreweries();

    // on manual location change
    $scope.$on('g-places-autocomplete:select', function(event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));
      $scope.lat = location.lat;
      $scope.lng = location.lng;
      $scope.location = {
        town : place.formatted_address
      };
      getBreweries("noGeo");
    });

    // filters
    //filter: Get the selected radius from users position
    $scope.showSelectValue = function(radiusSelect) {
      var str = radiusSelect;
      str = radiusSelect.substring(0, str.length - 3);

      // Write new radius in variable
      $scope.radius = str;

      // Reload breweries
      getBreweries("noGeo");
    };


    //Filter: Get the selected location Type and push it to getBreweries function
    $scope.showLocationType = function(locationSelect) {
      var str = locationSelect;
      console.log(str);

      // Write new radius in variable
      $scope.locationType = str;

      // Reload breweries
      getBreweries("noGeo");
    };


    // Get breweries function
    // When parameter is given, disable geolocation
    function getBreweries(noGeo) {
      $scope.breweries = [];

      // TODO ERROR HANDLING
      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
      });

      if(noGeo){
        beerService.getBreweriesNearCoordinates($scope.lat, $scope.lng, $scope.radius).then(result => {
          // Map results and push beer informations in breweries array
          result.data.map(brewery => {
            beerService.getBeersByBrewery(brewery.brewery.id).then(allBeerByBrewery => {
              brewery.beers = allBeerByBrewery.data;
              $scope.breweries.push(brewery);
            });
          });
          $ionicLoading.hide()


        });
      }
      else {
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

              // GET BREWERIES
              beerService.getBreweriesNearCoordinates($scope.lat, $scope.lng, $scope.radius).then(result => {
                result.data.map(brewery => {
                  beerService.getBeersByBrewery(brewery.brewery.id).then(allBeerByBrewery => {
                    brewery.beers = allBeerByBrewery.data;
                    $scope.breweries.push(brewery);
                  });
                });
                $ionicLoading.hide()
              });
            });
          }, function(err) {
            $scope.connectionError = true;
            //TODO ERROR: NO INTERNET; NO GPS OR ELSE
          });
      }




    }


  })
  .controller('beerListCtrl', function($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const breweryId = $stateParams.brewery;

    // Get beers
    beerService.getBeersByBrewery(breweryId).then(result => {
      $scope.beerList = result.data;
    });

    // Get brewery informations
    beerService.getBreweryById(breweryId).then(result => {
      $scope.brewery = result.data;
    });

    // TODO ERROR HANDLING


  });



