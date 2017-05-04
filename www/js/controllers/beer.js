angular.module('beeround.beer', [])
  .controller('breweriesListCtrl', function ($scope, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading, $timeout) {

    $scope.place = undefined;

    //INIT
    $scope.listTypeSelect = "breweryList";

    //INIT
    $scope.citySelect = 'allCities';

    // INIT radius var and set to  50
    //$scope.radius = 50;


    // Only show locations in DE
    $scope.autocompleteOptions = {
      componentRestrictions: {country: 'de'},
      types: ['geocode']
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

          if (result.data) {
            // Get beers
            let promises = result.data.map(function (obj) {
              return getBeers(obj).then(result => {
                return result
              });
            });

            // Save to var
            Promise.all(promises).then(function (results) {
              $timeout(function () {
                $scope.breweries = results;
                $ionicLoading.hide();
              }, 0);
            });
          }
          else {
            $ionicLoading.hide();
          }

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

                // Get beers
                let promises = result.data.map(function (obj) {
                  return getBeers(obj).then(result => {
                    return result
                  });
                });

                // Save to var
                Promise.all(promises).then(function (results) {
                  $timeout(function () {
                    $scope.breweries = results;

                    console.log(beerService.breweries);
                    $ionicLoading.hide();
                  }, 0);
                });

              });
            });
          }, function (err) {
            $scope.connectionError = true;
            //TODO ERROR: NO INTERNET; NO GPS OR ELSE
          });
      }
    }

    function getBeers(brewery) {
      return new Promise(function (resolve, reject) {
        beerService.getBeersByBrewery(brewery.brewery.id).then(allBeerByBrewery => {
          brewery.beers = allBeerByBrewery.data;
          return resolve(brewery);
        }, function () {
          console.log("err")
        });
      });
    }

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
  .controller('mapCtrl', function ($scope, $state, $rootScope, beerService, $http, $cordovaGeolocation, $ionicLoading) {

    // REFRESH Markers on change view
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        if(toState.name == "tabs.map") {
          setMarker();
        }
      });

    if ($rootScope.userSettings) {
      let latLng = new google.maps.LatLng($rootScope.userSettings.lat, $rootScope.userSettings.lng);

      let mapOptions = {
        center: latLng,
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Enable Infowindow
      let infowindow = new google.maps.InfoWindow;

      let myposition = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5
        },
      });

      google.maps.event.addListener(myposition, 'click', (function (myposition) {
        return function () {
          infowindow.setContent("Du bist hier");
          infowindow.open(map, myposition);
        }
      })(myposition));

      setMarker();
      // Hide loading
      $ionicLoading.hide();
    }


    function setMarker () {



      //GET Breweries around
      beerService.getBreweriesNearCoordinates($rootScope.userSettings).then(location => {

        console.log("new request");
        location.data.map((result, index) => {
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(result.latitude, result.longitude),
            map: $scope.map,
          });

          //Add marker
          google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
              infowindow.setContent(result.brewery.name);
              infowindow.open(map, marker);
            }
          })(marker));
        });
      });
    }

  })
  .controller('beerDetailsCtrl', function ($scope, beerService, $http, $cordovaGeolocation, $stateParams, $state) {
    const beerId = $stateParams.beerId;

    beerService.getBeerDetails(beerId).then(result => {
      $scope.beer = result.data;

    })

  });



