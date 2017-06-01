angular.module('beeround.beer', [])

  .controller('breweriesListCtrl', function ($scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaGeolocation, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser) {

    // REFRESH Breweries on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        document.getElementById('searchLocation').value = "";

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
          $scope.appBackground = document.getElementsByClassName('appBackground');
          console.log($scope.appBackground[0]);
        $scope.appBackground[0].setAttribute('class', 'blur');
      };



      $scope.closePopover = function () {
      $scope.popover.hide();
          $scope.appBackground = document.getElementsByClassName('blur');
          $scope.appBackground[0].setAttribute('class', 'view appBackground');
      };

    $scope.tabs = [
      {"text": "Brauereien"},
      {"text": "Biere"},
      {"text": "Events"},
    ];

   // $scope.currentListView = $scope.tabs[0].text;


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

    $scope.filterLocationType = "allLocationTypes";


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

      $rootScope.currentListView = $scope.tabs[data.index].text;


      if(data.index == 0) {
        if($scope.activeSorting == "rating"){
          $scope.sortBreweries("distance");
        }
      }
      if (data.index == 1) {
        beeroundService.getBeerRatingByBrewerielist($scope.breweries).then(result => {
          $scope.breweries = result;
        })
      }
      if (data.index == 2) {
        getBeerEvents();
      }

    };

    // Sort Breweries
    $scope.sortBreweries = function (propertyName) {
      $scope.activeSorting = propertyName;

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      if (propertyName === 'name') {
        $scope.breweries.sort(function (a, b) {
          if (a.brewery.name < b.brewery.name) return -1;
          if (a.brewery.name > b.brewery.name) return 1;
          return 0;
        });

      }
      else if (propertyName === 'distance') {

        $scope.breweries.sort(function (a, b) {
          if (a.distance < b.distance) return -1;
          if (a.distance > b.distance) return 1;
          return 0;
        })
      }
    };

    // Sort Breweries
    $scope.sortBeers = function (propertyName) {
      $scope.activeSorting = propertyName;

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      if (propertyName === 'name') {
        makeBeerList();
      }
      else if (propertyName === 'distance') {
        $scope.allBeers = undefined;
        $scope.breweries.sort(function (a, b) {
          if (a.distance < b.distance) return -1;
          if (a.distance > b.distance) return 1;
          return 0;
        })
      }

      else if (propertyName === 'rating') {
        makeBeerList();
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
      getBeerEvents();

    });


    // filters
    //Filter: Get the selected radius from users position

    $scope.setRadius = function (radius) {

      // Write new radius in variable
      $rootScope.userSettings.radius = radius;

      // Reload breweries
      getBreweries("noGeo");

      // Reload events
      getBeerEvents();

    };

    //Filter: Set new type

    $scope.setType = function (type) {

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      $scope.filterLocationType = type;

    };


    // Init beer for name sorting
    function makeBeerList() {

      if ($scope.activeSorting == "name" && $scope.breweries) {
        $scope.allBeers = [];


        $scope.breweries.map(function (brewery, index) {
          if (brewery.beers) {
            brewery.beers.map(function (beer) {
              beer.brewery = brewery.brewery.name;
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

      if ($scope.activeSorting == "rating" && $scope.breweries) {
        $scope.allBeers = [];

        //TODO SORT RATING BUGFIXING

        $scope.breweries.map(function (brewery) {
          if (brewery.beers) {
            brewery.beers.map(function (beer) {
              beer.brewery = brewery.brewery.name;

              $scope.allBeers.push(beer);

            });
          }
        });
        $timeout(function () {
          $scope.allBeers.sort(function (a, b) {
            if (a.rating > b.rating) return -1;
            if (a.rating < b.rating) return 1;
            return 0;
          });

        },4000)

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

        breweryDB.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

          $scope.breweries = result;

          $ionicLoading.hide();

          if (result) {
            $scope.noData = false;

            // Resize
            $ionicScrollDelegate.resize();

            // Update beer array, if beer screen is shown
            if($rootScope.currentListView == "Biere"){
              beeroundService.getBeerRatingByBrewerielist(result).then(newList => {
                $scope.breweries = newList;
                makeBeerList();
              })
            }
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

        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
        });

        // Geolocation
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {


            $rootScope.userSettings = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 30 // standard
            };

            $http.get('https://nominatim.openstreetmap.org/reverse?lat=' + $rootScope.userSettings.lat + '&lon=' + $rootScope.userSettings.lng + '&format=json').then(result => {
              $rootScope.location = result.data.address;

              // GET BREWERIES
              breweryDB.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

                $scope.breweries = result;
                $ionicLoading.hide();

                // Update beer array, if beer screen is shown
                if($rootScope.currentListView == "Biere"){
                  beeroundService.getBeerRatingByBrewerielist($scope.breweries).then(result => {
                    $scope.breweries = result;
                    makeBeerList();
                  })
                }

                // Resize
                $ionicScrollDelegate.resize();

              }, function () {
                $ionicLoading.hide();

                alert("err")
              });
            }, function (err) {
              $ionicLoading.hide();

              $scope.connectionError = true;

              //TODO ERROR: NO INTERNET; NO GPS OR ELSE
            });


          })
      }
    }



    function getBeerEvents() {
      $scope.beerEvents = [];

      beeroundService.getBreweryEvent($rootScope.userSettings).then(result => {

        $scope.beerEvents = result;

      });
    }


     $scope.createEvent = function () {

       $cordovaCalendar.createCalendar({
         calendarName: 'Beeround',
         calendarColor: '#FF0000'
       }).then(function (result) {
         $cordovaCalendar.createEvent({
           title: 'Space Race',
           location: 'The Moon',
           notes: 'Bring sandwiches',
             startDate: new Date(2017, 5, 17, 18, 30, 0, 0, 0),
             endDate: new Date(2017, 5, 17, 19, 30, 0, 0, 0)
         }).then(function (result) {
           alert("PROST!")
         }, function (err) {
           alert("Hnzufügen fehlgeschlagen")
         })
       }, function (err) {
         // error
       });

        }
  })

  .controller('mapCtrl', function ($scope, NgMap, $state, $rootScope, breweryDB, beeroundService, $http, $cordovaGeolocation, $ionicLoading, $ionicPopover, $ionicUser) {

    // IF NO USERSETTING
    if(!$rootScope.userSettings){
      console.log("Local Settings");
      $rootScope.userSettings = {
        lat:"49.34891529999999" ,
        lng:"9.129382899999996"
      };
      loadMap(30);

    }
    $scope.markers = [];


    // on manual location change
    $scope.$on('g-places-autocomplete:select', function (event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));
      console.log(location);
        $rootScope.userSettings.lat = location.lat;
        $rootScope.userSettings.lng = location.lng;
        $rootScope.location = {
          town: place.formatted_address

      };
      loadMap($rootScope.userSettings.radius);

    });

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

    // New geolocation
    $scope.newGeolocation = function () {

      // Clear text field
      document.getElementById('searchLocation').value = "";

      let posOptions = {timeout: 20000, enableHighAccuracy: false};

      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
      });


      // Geolocation
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {


          $rootScope.userSettings = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 30 // standard
          };

          loadMap($rootScope.userSettings.radius);

        })
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
        breweryDB.getBreweriesNearCoordinates($rootScope.userSettings).then(location => {

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

    function getBeerEvents() {
      $scope.beerEvents = [];

      beeroundService.getBreweryEvent().then(result => {
        console.log(result.events);
        $scope.beerEvents = result.events;

      });
    }
  })

  .controller('beerListCtrl', function ($scope, breweryDB, beeroundService, $http, $cordovaGeolocation, $stateParams, $state, $ionicPopover, $ionicUser) {
    const breweryId = $stateParams.brewery;

    $scope.activeWindow = 'beer';

      //FORMAT PHONE NUMBER
      $scope.formatPhoneNumber = function(phoneNumber) {

          let formattedNumber = phoneNumber;

          console.log(formattedNumber);

          formattedNumber = formattedNumber.replace(/\s/g, '');
          formattedNumber = formattedNumber.replace('-', '');
          formattedNumber = formattedNumber.replace('\(', '');
          formattedNumber = formattedNumber.replace('\)', '');

          if (formattedNumber.substr(0, 1) == "0") {
              formattedNumber = formattedNumber.substr(1);
          }

          console.log(formattedNumber);

      };


      // Get beers
    breweryDB.getBeersByBrewery(breweryId).then(result => {

      if (result) {
        $scope.beerList = result;
        $scope.noData = false;

      }
      else {
        $scope.noData = true;
      }
    });

    // Get brewery informations
    breweryDB.getBreweryById(breweryId).then(result => {
      $scope.brewery = result.data;
    });

    beeroundService.getEventByBrewery(breweryId).then(results => {
      $scope.eventList = results;

    });

      //FORMAT PHONE NUMBER

      $scope.formatNumber = function (phonenumber) {

          let formattedNumber = phonenumber;
          formattedNumber = formattedNumber.replace(/\s/g, '');
          formattedNumber = formattedNumber.replace(/-/g, '');
          formattedNumber = formattedNumber.replace(/\//g, '');
          formattedNumber = formattedNumber.replace(/\)/g, '');
          formattedNumber = formattedNumber.replace(/\(/g, '');

            console.log(formattedNumber);

          if (formattedNumber.substr(0, 2) == "49") {
              formattedNumber = formattedNumber.substr(2);
          }

          else if(formattedNumber.substr(0,1) == "+49"){
              formattedNumber = formattedNumber.replace('+49', '0');
          }
            console.log(formattedNumber);
            window.location.href="tel://"+formattedNumber;
    }
  })

  .controller('beerDetailsCtrl', function ($location, $scope, beeroundService, breweryDB, $http, $cordovaGeolocation, $stateParams, $state, $ionicUser,$timeout) {
    let beerId = $stateParams.beerId;

    // Make User data output available in view
    $scope.$ionicUser = $ionicUser;
    $scope.form = [];


    // INIT RATE BEER
    $scope.characteristicsWindow = false;

    $scope.sliderSueffig = {value: 50};
    $scope.sliderMalzig = {value: 50};
    $scope.sliderHerb = {value: 50};
    $scope.sliderErfrischend = {value: 50};

    beeroundService.getRatingByUser(beerId, $ionicUser.id).then(rating => {
      $scope.currentRating = rating;

    });

    breweryDB.getBeerDetails(beerId).then(result => {
      $scope.beer = result.data;

      beeroundService.postBeer(result.data).then(function (result) {
        console.log(result);
      })
    });

    beeroundService.getComments(beerId).then(function (result) {
      $scope.comments = result.data.comments;
    });



    beeroundService.getCharacteristicsByUser(beerId, $ionicUser.id).then(result => {

        $scope.sliderSueffig = {value: result.sueffig};
        $scope.sliderMalzig = {value: result.malzig};
        $scope.sliderHerb = {value: result.herb};
        $scope.sliderErfrischend = {value: result.erfrischend};


    });




    // Characteristics range
    $scope.changeCharacteristicsWindow =function(){
      if ($scope.characteristicsWindow){
        $scope.characteristicsWindow = false;
      }
      else {
        $scope.characteristicsWindow = true;
      }
    };



    $scope.$on("slideEnded", function() {

        let data = {
          userid : $ionicUser.id,
          beerid : beerId,
          sueffig : $scope.sliderSueffig.value,
          malzig : $scope.sliderMalzig.value,
          herb : $scope.sliderHerb.value,
          erfrischend : $scope.sliderErfrischend.value,
        };

        beeroundService.postCharacteristics(data).then(function () {
          console.log("success");
        })
    });

    $scope.slider = {
      options: {
        floor: 0,
        ceil: 100,
        step: 25,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true,
        stepsArray: [
          {value: 0, legend: '-'},
          {value: 25},
          {value: 50, legend:'o'},
          {value: 75},
          {value: 100, legend: '+'}
        ],
      }
    };


    // TODO Select rating on beer click

    $scope.positivRating = function () {
      if($scope.currentRating < 5) {
        $scope.currentRating++;
        sendRating()

      }
    };

    $scope.negativeRating = function () {
      if($scope.currentRating > 0){
        $scope.currentRating--;
        sendRating()
      }
    };

    $scope.sendComment = function () {
      let data = {
        beerid : beerId,
        userid : $ionicUser.id,
        username: $ionicUser.details.username,
        comment : $scope.form.comment
      };

      beeroundService.postComment(data).then(function () {
        alert("success");
        $scope.form.comment = "";
        $state.go('tabs.beerDetails', {beerId: beerId});

        // TODO CUSTOM FEEDBACK

      }, function () {
        // FAIL
        alert("Fehlgeschlagen")

        //TODO ERROR HANDLING
      })
    };


    function sendRating(){
      let data = {
        beerid : beerId,
        userid : $ionicUser.id,
        userimage : $ionicUser.image,
        rating : $scope.currentRating
      };

      beeroundService.sendBeerRating(data).then(result => {
        console.log("Rating send");
      })
    }

  });









