angular.module('beeround.beer', [])

  .controller('breweriesListCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, beerService, $http, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser) {

    // REFRESH Breweries on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "tabs.breweryList") {
          getBreweries("noGeo");
        }
      });

    // Handle PopOver
    $ionicPopover.fromTemplateUrl('filter.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function () {
      $scope.popover.show();
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

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

    $scope.tabs = [
      {"text": "Brauereien"},
      {"text": "Biere"},
      {"text": "Events"},
    ];
    $scope.currentListView = $scope.tabs[0].text;


    $scope.place = undefined;

    //INIT set default variable for locationType
    $scope.filterLocationType = 'allLocationTypes';

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


    // Load breweries on start
    getBreweries();


    // New geolocation
    $scope.newGeolocation = function () {
      // Clear text field
      document.getElementById('searchLocation').value = "";

      getBreweries();

    };

    // Change variable on slide
    $scope.onSlideMove = function (data) {
      $scope.currentListView = $scope.tabs[data.index].text;

      if (data.index == 1) {
        makeBeerList();
      }
    };

    $scope.sortBy = function (propertyName) {
      $scope.activeSorting = propertyName;

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      //TODO Save sorting onchange

      if (propertyName === 'name') {
        $scope.breweries.sort(function (a, b) {
          if (a.brewery.name < b.brewery.name) return -1;
          if (a.brewery.name > b.brewery.name) return 1;
          return 0;
        });

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
    };


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

    $scope.setRadius = function (radius) {

      // Write new radius in variable
      $rootScope.userSettings.radius = radius;

      // Reload breweries
      getBreweries("noGeo");
    };

    //Filter: Set new type

    $scope.setType = function (type) {

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      //If new type is equal to current type
      if ($scope.filterLocationType == type) {
        $scope.filterLocationType = 'allLocationTypes';
      }
      else {
        $scope.filterLocationType = type;
      }
    };


    // Init beer for name sorting
    function makeBeerList() {

      if ($scope.activeSorting == "name" && $scope.breweries) {
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

            // Resize
            $ionicScrollDelegate.resize();

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

                // Resize
                $ionicScrollDelegate.resize();

              });
            }, function (err) {
              $scope.connectionError = true;
              //TODO ERROR: NO INTERNET; NO GPS OR ELSE
            });


          })
      }
    }
  })

  .controller('beerListCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state, $ionicPopover) {
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

  .controller('mapCtrl', function ($scope, NgMap, $state, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading, $ionicPopover) {

    $scope.markers = [];

    // Handle PopOver
    $ionicPopover.fromTemplateUrl('filter.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function () {
      $scope.popover.show();
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };


    NgMap.getMap().then(function (map) {
      google.maps.event.trigger(map, 'resize');

      $scope.map = map;

      if ($rootScope.userSettings) {

        switch ($rootScope.userSettings.radius) {
          case 10:
            $scope.zoom = 10;
            break;
          case 30:
            $scope.zoom = 9;
            break;
          case 50:
            $scope.zoom = 8;
            break
        }

        $scope.zoomChanged = function (e) {
          if (map.getZoom() < 8) {
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
              loadMap(10);
              break;
            default:
              break


          }
        };
      }
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

      if (radius) {

        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
        });

        $rootScope.userSettings.radius = radius;

        $scope.markers = [];

        //GET Breweries around
        beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(location => {

          if (location) {

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
          else {
            $ionicLoading.hide();
          }

        })
      }
    }
  })

  .controller('beerDetailsCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const beerId = $stateParams.beerId;

    beerService.getBeerDetails(beerId).then(result => {
      $scope.beer = result.data;
    })

  });






