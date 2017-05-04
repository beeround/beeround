angular.module('beeround.beer', [])

  .controller('breweriesListCtrl', function ($scope, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading, $timeout) {


    $scope.place = undefined;

    //INIT set default variable for brewery and beer list
    $scope.listTypeSelect = "breweryList";

    //INIT set default variable for locationType
    $scope.filterLocationType = 'allLocationTypes';

    //INIT set default variable for location
    $scope.citySelect = 'allCities';

    // INIT radius var and set to  50
    //$scope.radius = 50;


    // Only show locations in DE
    $scope.autocompleteOptions = {
      componentRestrictions: {country: 'de'},
      types: ['geocode']
    };


    // INIT sorting settings

    $scope.propertyName = 'name';
    $scope.sortReverse = false;

    //start sorting function


    $scope.sortBy = function (propertyName) {

      //TODO Save sorting onchange

      if (propertyName === 'name') {

        $scope.breweries.sort(function (a, b) {
          if (a.brewery.name < b.brewery.name) return -1;
          if (a.brewery.name > b.brewery.name) return 1;
          return 0;

        })

        /*
         Console Check if function works
         for (brewery of $scope.breweries) {
         console.log(brewery.brewery.name);
         }*/

      }

      else if (propertyName === 'rating') {
        //TODO
      }


      else if (propertyName === 'distance') {

        $scope.breweries.sort(function (a, b) {
          if (a.distance < b.distance) return -1;
          if (a.distance > b.distance) return 1;
          return 0;

        })
      }
    };


    // Load breweries on start
    getBreweries();


    // on manual location change
    $scope.$on('g-places-autocomplete:select', function (event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));

      $rootScope.userSettings.lat = location.lat;
      $rootScope.userSettings.lng = location.lng;
      $rootScope.location = {
        town: place.formatted_address
      };
      getBreweries("noGeo");
    });


    // filters

    //filter: Get the selected radius from users position
    $scope.showSelectValue = function (radiusSelect) {
      var str = radiusSelect;
      str = radiusSelect.substring(0, str.length - 3);

      // Write new radius in variable
      $rootScope.userSettings.radius = str;

      // Reload breweries
      getBreweries("noGeo");
    };


    //Filter: Get the selected location Type and push it to getBreweries function
    $scope.showLocationType = function (locationSelect) {
      var str = locationSelect;
      console.log(str);

      //TODO: Reload Filter with new Select

      // Reload breweries
      getBreweries("noGeo");
    };


    //Filter: Get the users select if open or closed and push it to getBreweries function
    $scope.showOpenOrClosedLocations = function (openClosedSelect) {
      var str = openClosedSelect;
      console.log(str);

      //TODO: Reload Filter with new Select

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

      if (noGeo) {

        beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

          $scope.breweries = result;
          $ionicLoading.hide();


          //TODO ERROR HANDLING

        });
      }
      else {
        // Don't wait till death
        let posOptions = {timeout: 20000, enableHighAccuracy: false};

        // Geolocation
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {


            $rootScope.userSettings = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 30 // standard
            };

            $http.get('http://nominatim.openstreetmap.org/reverse?lat=' + $rootScope.userSettings.lat + '&lon=' + $rootScope.userSettings.lng + '&format=json').then(result => {
              $rootScope.location = result.data.address;

              console.log($rootScope.userSettings);

              // GET BREWERIES
              beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

                $scope.breweries = result;
                $ionicLoading.hide();

              });
            }, function (err) {
              $scope.connectionError = true;
              //TODO ERROR: NO INTERNET; NO GPS OR ELSE
            });


          })
      }
    };
  })
  .controller('beerListCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
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

  })

  .controller('mapCtrl', function ($scope, NgMap, $state, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading) {

    $scope.markers = [];

    NgMap.getMap().then(function (map) {
      $scope.map = map;
      loadMap();
    });


    $scope.showTextbox = function (e, data) {
      $scope.boxContent = data;
      $scope.map.showInfoWindow('overlay', data.id);
    };


    // REFRESH Markers on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "tabs.map") {
          loadMap();
        }
      });


    function loadMap() {
      $scope.markers = [];

      if ($rootScope.userSettings) {

        if ($rootScope.userSettings.radius == 10) {
          $scope.zoom = 11;
        }
        if ($rootScope.userSettings.radius == 20) {
          $scope.zoom = 10;
        }
        if ($rootScope.userSettings.radius == 30) {
          $scope.zoom = 9;
        }
        if ($rootScope.userSettings.radius > 40) {
          $scope.zoom = 8;
        }
      }

      //GET Breweries around
      beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(location => {
        location.map((result, index) => {

          $scope.markers.push({
            id: result.brewery.id,
            name: result.brewery.nameShortDisplay,
            lat: result.latitude,
            lng: result.longitude
          });

          // Hide loading
          $ionicLoading.hide();


        }, function (error) {
          console.log("Could not get location");
        });
      })
    }
  })

  .controller('beerDetailsCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const beerId = $stateParams.beerId;

    beerService.getBeerDetails(beerId).then(result => {
      $scope.beer = result.data;

    })

  });






