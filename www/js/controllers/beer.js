angular.module('beeround.beer', [])

  .controller('breweriesListCtrl', function ($scope, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser) {

    let details = {'email': 'xxx@web.de', 'password': '123123123'};

    /* $ionicAuth.signup(details).then(function() {
     // `$ionicUser` is now registered
     }, function(err) {
     for (var e of err.details) {
     if (e === 'conflict_email') {
     alert('Email already exists.');
     } else {
     // handle other errors
     }
     }
     });*/

    $scope.place = undefined;

    //INIT set default variable for locationType
    $scope.filterLocationType = 'allLocationTypes';

    //INIT set default variable for brewery and beer list
    $scope.listTypeSelect = "breweryList";

    // INIT FILTER
    $scope.radiusSelect = "30 km";

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

    // Start sorting function
    $scope.activeSorting = "distance";

    $scope.sortBy = function (propertyName) {
      $scope.activeSorting = propertyName;

      //TODO Save sorting onchange
      if ($scope.listTypeSelect === 'breweryList') {
        console.log($scope.listTypeSelect);

        if (propertyName === 'name') {
          $scope.breweries.sort(function (a, b) {
            if (a.brewery.name < b.brewery.name) return -1;
            if (a.brewery.name > b.brewery.name) return 1;
            return 0;
          })
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
      } else {
        if (propertyName === 'name') {
          makeBeerList();


        }
        else if (propertyName === 'rating') {
          //TODO
        }
        else if (propertyName === 'distance') {

          $scope.allBeers = undefined;
          $scope.breweries.sort(function (a, b) {
            if (a.distance < b.distance) return -1;
            if (a.distance > b.distance) return 1;
            return 0;

          })
        }
      }
    };


    // REFRESH Breweries on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "tabs.breweryList") {
          getBreweries("noGeo");
        }
      });

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
    //Filter: Get the selected radius from users position
    $scope.showSelectValue = function (radiusSelect) {
      var str = radiusSelect;
      str = radiusSelect.substring(0, str.length - 3);

      // Write new radius in variable
      $rootScope.userSettings.radius = str;

      // Reload breweries
      getBreweries("noGeo");
    };

    //Filter: Get the selected location Type and push it to getBreweries function
    $scope.showLocationType = function (listTypeSelect) {
      let str = listTypeSelect;

      $scope.listTypeSelect = str;

      makeBeerList();

      // Reload breweries
      //getBreweries("noGeo");
    };


    //Filter: Get the users select if open or closed and push it to getBreweries function
    $scope.showOpenOrClosedLocations = function (openClosedSelect) {
      var str = openClosedSelect;
      console.log(str);

      //TODO: Reload Filter with new Select

      // Reload breweries
      getBreweries("noGeo");
    };



    // Init beer for name sorting
    function makeBeerList () {

      if($scope.activeSorting == "name" && $scope.breweries){
        $scope.allBeers = [];

        $scope.breweries.map(function (brewery) {
          if (brewery.beers) {
            brewery.beers.map(function (beer) {
              $scope.allBeers.push(beer);
            });
          }
        });

        $scope.allBeers.sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
      }

    }

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
        console.log("Abfrage ohne Ortung");

        beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

          $scope.breweries = result;

          $ionicLoading.hide();

          if (result) {
            $scope.noData = false;

            // Update beer array
            makeBeerList();
          }

          else {
            let alertPopup = $ionicPopup.alert({
              title: 'Suche nicht erfolgreich!',
              template: 'Bitte passe deine Suchanfrage an. '
            });

            alertPopup.then(function (res) {
              $scope.noData = true;
            });
          }

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
    }
  })
  .controller('beerListCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const breweryId = $stateParams.brewery;

    // Get beers
    beerService.getBeersByBrewery(breweryId).then(result => {
      if (result.data) {
        $scope.beerList = result.data;
        $scope.noData = false;

      }
      else {
        $scope.noData = true;

      }
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

      switch ($rootScope.userSettings.radius) {
        case 10:
          $scope.zoom = 11;
          break
        case 20:
          $scope.zoom = 10;
          break
        case 30:
          $scope.zoom = 9;
          break
        case 40:
          $scope.zoom = 9;
          break
        case 50:
          $scope.zoom = 8;
          break
      }

      $scope.zoomChanged = function(e) {
        if (map.getZoom() < 8){
          map.setZoom(8);
        }

        switch (map.getZoom()) {

          case 8:
            loadMap(50);
            break;
          case 9:
            loadMap(30);
            break;
          case 10:
            loadMap(20);
            break;
          case 11:
            loadMap(10);
            break;
          default:
            break


        }
      };

    });


    $scope.showTextbox = function (e, data) {
      $scope.boxContent = data;
      $scope.map.showInfoWindow('overlay', data.id);
    };


    // REFRESH Markers on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "tabs.map") {
          loadMap($rootScope.userSettings.radius);
        }
      });


    function loadMap(radius) {

      $rootScope.userSettings.radius = radius;
      $scope.markers = [];

      //GET Breweries around
      beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(location => {

        if(location){

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
        }

      })
    }
  })

  .controller('beerDetailsCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const beerId = $stateParams.beerId;

    beerService.getBeerDetails(beerId).then(result => {
      $scope.beer = result.data;

    })

  });






