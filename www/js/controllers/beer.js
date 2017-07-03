angular.module('beeround.beer', [])


  .controller('breweriesListCtrl', function ($rootScope, $scope, $ionicScrollDelegate, $rootScope, $ionicPopover, breweryDB, beeroundService, $http, $cordovaGeolocation, $cordovaCalendar, $ionicLoading, $timeout, $ionicPopup, $ionicAuth, $ionicUser, $location, $stateParams) {
    let breweryId = $stateParams.breweryId;

    // REFRESH Breweries on change view
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        document.getElementById('searchLocation').value = "";

        // UPDATE RATING
        if (toState.name == "tabs.breweryList") {
          if(fromParams.beerId){

            $scope.allBeers.map(beer => {
              if(beer.id == fromParams.beerId){

                if(beer.rating != fromParams.rating){
                  beer.rating = fromParams.rating
                }
              }
            })
          }

          //getBreweries("noGeo");
        }
      });


    //Send Feedback Mail to Event organizer

    $scope.sendMail = function () {
      if($ionicUser.id){
        beeroundService.postContact($ionicUser.id).then(function(){
          trophyService.checkContactTrophies($ionicUser.id).then(result => {
            if(result != 0){
              let tmpvar = ' Kontaktanfragen';
              if(result.step == 1){
                tmpvar = ' Kontaktanfrage'
              }
              $rootScope.newTrophy(result.img, result.rank, result.step, 'contact')
            }
          });
        });
      }
      window.open("mailto:mail@domi-speh.de", '_system');
    };

    // Handle PopOver Filter
    $ionicPopover.fromTemplateUrl('filter.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function () {
      $scope.popover.show();
      $scope.appBackground = document.getElementsByClassName('appBackground');
     $scope.appBackground[0].setAttribute('class', 'view blur');
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
     $scope.appBackground = document.getElementsByClassName('blur');
     $scope.appBackground[0].setAttribute('class', 'view appBackground');
    };

    $ionicPopover.fromTemplateUrl('information.html', {

      scope: $scope
    }).then(function (information) {
      $scope.information = information;
    });

    $scope.openInformation = function () {
      $scope.information.show();
      $scope.appBackground = document.getElementsByClassName('appBackground');
      $scope.appBackground[0].setAttribute('class', 'view blur');
    };
    $scope.closeInformation = function () {
      $scope.information.hide();
      $scope.appBackground = document.getElementsByClassName('blur');
      $scope.appBackground[0].setAttribute('class', 'view appBackground');
    };


    // TABS
    $scope.tabs = [
      {"text": "Brauereien"},
      {"text": "Biere"},
      {"text": "Events"},
    ];

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

    // INIT filter
    $scope.beerCategory = '';


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


      if (data.index == 0) {
        if ($scope.activeSorting == "rating") {
          $scope.sortBreweries("distance");
        }
      }
      if (data.index == 1) {
        beeroundService.getBeerRatingByBrewerielist($scope.breweries).then(result => {
          $scope.breweries = result;
          console.log(result);
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

    // Sort Beers
    $scope.sortBeers = function (propertyName) {
      $scope.activeSorting = propertyName;

      // Scroll to top
      $ionicScrollDelegate.scrollTop();

      if (propertyName === 'name') {
        makeBeerList();
      }
      else if (propertyName === 'distance') {

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

    $scope.setCategory = function (cat) {
      $scope.beerCategory = cat;
    };


    // Init beer for name sorting
    function makeBeerList() {
      $scope.allBeers = [];
      $scope.breweries.map(function (brewery, index) {
        if (brewery.beers) {
          brewery.beers.map(function (beer) {
            beer.brewery = brewery.brewery.name;
            $scope.allBeers.push(beer);
          });
        }
      });
    }

    // Get breweries function
    // When parameter is given, disable geolocation
    function getBreweries(noGeo) {
      $scope.breweries = [];
      $scope.addBeerForm = [];
      $scope.allBeers = [];


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
            if ($rootScope.currentListView == "Biere") {
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
        let posOptions = {timeout: 15000, enableHighAccuracy: false};


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
                if ($rootScope.currentListView == "Biere") {
                  beeroundService.getBeerRatingByBrewerielist($scope.breweries).then(result => {
                    $scope.breweries = result;
                    makeBeerList();
                  })
                }

                // Resize
                $ionicScrollDelegate.resize();

              }, function () {
                $ionicLoading.hide();

                let alertPopup = $ionicPopup.alert({
                  title: 'Keine Biere gefunden. Versuche es erneut!',
                });
              });
            }, function (err) {
              $ionicLoading.hide();

              $scope.connectionError = true;


              let alertPopup = $ionicPopup.alert({
                title: 'Bitte überprüfe deine Verbindungen!',
              });
            });


          },function () {

            // NO GEO Access
            console.log("no Access");
            $rootScope.userSettings = {
              lat: "49.35357",
              lng: "9.15106",
              radius: 30
            };

            // GET BREWERIES
            breweryDB.getBreweriesNearCoordinates($rootScope.userSettings).then(result => {

              $scope.breweries = result;
              $ionicLoading.hide();

              // Update beer array, if beer screen is shown
              if ($rootScope.currentListView == "Biere") {
                beeroundService.getBeerRatingByBrewerielist($scope.breweries).then(result => {
                  $scope.breweries = result;
                  makeBeerList();
                })
              }

              // Resize
              $ionicScrollDelegate.resize();

            }, function () {
              $ionicLoading.hide();

              let alertPopup = $ionicPopup.alert({
                title: 'Keine Biere gefunden. Versuche es erneut!',
              });
            });

            let alertPopup = $ionicPopup.alert({
              title: 'Ortung nicht erlaubt!',
              template: 'Bitte erlaube Beeround, auf deinen Standort zuzugreifen. Als Standort wurde nun Mosbach gesetzt.',

            });})
      }
    }

    // get all beer Events
    function getBeerEvents() {
      $scope.beerEvents = [];

      beeroundService.getBreweryEvent($rootScope.userSettings).then(result => {

        result.map(event => {
          if(event.start > $scope.today){
            $scope.beerEvents.push(event)
          }
        });
      });
    }

    // initialise the options for the select box
    $scope.typeOptions = [
      {name: 'Bitte wählen', value: 'noData'},
      {name: 'Pils', value: '75'},
      {name: 'Weizenbier', value: '48'},
      {name: 'Kristallweizen', value: '49'},
      {name: 'Dunkles Weizen', value: '52'},
      {name: 'Lager', value: '77'},
      {name: 'Helles', value: '78'},
      {name: 'Starkbier', value: '90'},
      {name: 'Export', value: '79'},
      {name: 'Kölsch', value: '45'},
      {name: 'Schwarzbier', value: '84'},
      {name: 'Märzen', value: '81'},
      {name: 'Zwickelbier / Kellerbier ', value: '92'},
      {name: 'Rauchbier', value: '54'}
    ];

    // Jump two the second select option (angular bug)
    $scope.form = {type: $scope.typeOptions[0].value};

    //send a new beer to brewerydb
    $scope.addBeer = function () {
      //beerform
      let data = {
        name: $scope.addBeerForm.name,
        styleId: $scope.form.type,
        abv: $scope.addBeerForm.abv,
        brewery: breweryId,
      };

      //error handling
      if ($scope.addBeerForm.name === undefined || $scope.addBeerForm.name.length <= 3) {
        $ionicPopup.alert({
          title: 'Zu kurzer oder leerer Name.',
          template: 'Der Name ist sehr kurz oder leer. Bitte überarbeite den Namen.',
        });
      } else {
        if ($scope.form.type === 'noData') {
          $ionicPopup.alert({
            title: 'Bitte wähle die Biersorte!',
          });
        } else {
          breweryDB.postBeer(data);
          let alertPopup = $ionicPopup.alert({
            title: 'Danke für deine Hilfe!',
            template: 'Wir prüfen deine Angaben und werden das Bier hinzufügen.',
          });
          alertPopup.then(function (res) {
            $location.url('/tab/list/' + breweryId);
          });
        }
      }
    };


  })
  .controller('mapCtrl', function ($scope, NgMap, $state, $rootScope, breweryDB, beeroundService, $http, $cordovaGeolocation, $ionicLoading, $ionicPopover, $ionicUser) {


    // IF NO USERSETTING
    if (!$rootScope.userSettings.lat) {

      $rootScope.userSettings = {
        lat: "49.35357",
        lng: "9.15106"
      };
      loadMap(30);

    }
    //initialise markers
    $scope.markers = [];


    // on manual location change
    $scope.$on('g-places-autocomplete:select', function (event, place) {

      const location = JSON.parse(JSON.stringify(place.geometry.location));

      $rootScope.userSettings.lat = location.lat;
      $rootScope.userSettings.lng = location.lng;
      $rootScope.location = {
        town: place.formatted_address

      };
      $scope.selectedBrewery = null;

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

    $scope.closeDetails = function () {
      $scope.selectedBrewery = null;

      for (let key in $scope.map.markers) {
        $scope.map.markers[key].setMap($scope.map);
      }
    };

    $scope.next = function () {

      let newIndex = $scope.selectedBrewery.index + 1;

      if (newIndex < $scope.markers.length) {

        $scope.showDetails("", $scope.markers[newIndex], newIndex);

      }
      else {
        newIndex = 0;
        $scope.showDetails("", $scope.markers[newIndex], newIndex);

      }

    };

    $scope.prev = function () {

      let newIndex = $scope.selectedBrewery.index - 1;

      if (newIndex >= 0) {

        $scope.showDetails("", $scope.markers[newIndex], newIndex);

      }
      else {
        newIndex = $scope.markers.length - 1;
        $scope.showDetails("", $scope.markers[newIndex], newIndex);

      }
    };

    $scope.showDetails = function (e, data, index) {

      for (let key in $scope.map.markers) {
        $scope.map.markers[key].setMap($scope.map);
      }

      for (let key in $scope.map.markers) {
        if (index + 1 != key) {
          $scope.map.markers[key].setMap(null);
        }
      }
      data.index = index;

      $scope.selectedBrewery = data;
      let coords = {
        lat: data.lat,
        lng: data.lng
      };
      $scope.map.panTo(coords);

      breweryDB.getBeersByBrewery(data.breweryId).then(results => {
        data.beers = results;

        beeroundService.getEventByBrewery(data.breweryId).then(events => {
          data.events = events;

        })
      });
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


    //load map with geolocations
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
              console.log(result);

              $scope.markers.push({
                breweryId: result.brewery.id,
                name: result.brewery.nameShortDisplay,
                lat: result.latitude,
                lng: result.longitude,
                address: result.streetAddress,
                city: result.locality,
                plz: result.postalCode
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
  .controller('beerListCtrl', function ($scope, breweryDB, beeroundService, $http, $cordovaGeolocation, $stateParams, $state, $ionicPopover, $ionicUser, $location, $ionicLoading) {
    const breweryId = $stateParams.brewery;
    console.log("Bier holen...");
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
    });

    $scope.activeWindow = 'beer';

    // Get all beers
    breweryDB.getBeersByBrewery(breweryId).then(result => {
      if (result) {
        console.log(result);
        $ionicLoading.hide();
        $scope.beerList = result;
        $scope.noData = false;
      }
      else {
        $ionicLoading.hide();
        $scope.noData = true;
      }
    }, err => {
      console.log(err)
    });
    // Get brewery informations
    breweryDB.getBreweryById(breweryId).then(result => {
      $scope.brewery = result.data;
    });

    beeroundService.getEventByBrewery(breweryId).then(results => {
      $scope.eventList = [];

      results.map(event => {
        if(event.start > $scope.today){
          $scope.eventList.push(event)
        }
      });

    });

    //FORMAT PHONE NUMBER

    $scope.formatNumber = function (phonenumber) {

      let formattedNumber = phonenumber;
      formattedNumber = formattedNumber.replace(/\s/g, '');
      formattedNumber = formattedNumber.replace(/-/g, '');
      formattedNumber = formattedNumber.replace(/\//g, '');
      formattedNumber = formattedNumber.replace(/\)/g, '');
      formattedNumber = formattedNumber.replace(/\(/g, '');


      if (formattedNumber.substr(0, 2) == "49") {
        formattedNumber = formattedNumber.substr(2);
      }

      else if (formattedNumber.substr(0, 1) == "+49") {
        formattedNumber = formattedNumber.replace('+49', '0');
      }
      if ($ionicUser.id) {
        beeroundService.postContact($ionicUser.id).then(function () {
          trophyService.checkContactTrophies($ionicUser.id).then(result => {
            if (result != 0) {
              let tmpvar = ' Kontaktanfragen';
              if (result.step == 1) {
                tmpvar = ' Kontaktanfrage'
              }
              $rootScope.newTrophy(result.img, result.rank, result.step, 'contact')
            }
          });
        });
      }
      window.open("tel://" + formattedNumber, '_system', 'location=yes');
    };

    // Navigate to location
    $scope.navigateGoogleMaps = function (name, lat, lng) {
      // TODO check device
      if (ionic.Platform.isIOS()) {
        window.open('http://maps.apple.com/?q=' + name + 'll=' + lat + ',' + lng, '_system', 'location=yes')
      }
      else {

        window.open('geo:' + lat + ',' + lng + '?q=' + name, '_system', 'location=yes')

      }
    };

    //open add beer view
    $scope.openAddBeerView = function (breweryid) {
      $location.url('/tab/details/beer/' + breweryid + '/add');

    };


  })
  .controller('beerDetailsCtrl', function ($rootScope, $cordovaVibration, $cordovaImagePicker, $ionicModal, $cordovaFileTransfer, $ionicActionSheet, $cordovaCamera, $ionicPopup, $location, $scope, beeroundService, breweryDB, $http, $cordovaGeolocation, $stateParams, $state, $ionicUser, $timeout, trophyService, $ionicLoading) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
    });
    let beerId = $stateParams.beerId;
    $scope.image = null;


    $stateParams.rating = "";


    // Make User data output available in view
    $scope.$ionicUser = $ionicUser;

    //Initialise the options for select box
    $scope.typeOptions = [
      {name: 'Bitte wählen', value: 'noData'},
      {name: 'Pils', value: '75'},
      {name: 'Weizenbier', value: '48'},
      {name: 'Kristallweizen', value: '49'},
      {name: 'Dunkles Weizen', value: '52'},
      {name: 'Lager', value: '77'},
      {name: 'Helles', value: '78'},
      {name: 'Starkbier', value: '90'},
      {name: 'Export', value: '79'},
      {name: 'Kölsch', value: '45'},
      {name: 'Schwarzbier', value: '84'},
      {name: 'Märzen', value: '81'},
      {name: 'Zwickelbier / Kellerbier ', value: '92'},
      {name: 'Rauchbier', value: '54'}
    ];

    // Jump to the second select option (angular bug)
    $scope.form = {type: $scope.typeOptions[0].value};

    // INIT RATE BEER
    $scope.characteristicsWindow = false;

    $scope.sliderSueffig = {value: 50};
    $scope.sliderMalzig = {value: 50};
    $scope.sliderHerb = {value: 50};
    $scope.sliderErfrischend = {value: 50};

    beeroundService.getRatingByUser(beerId, $ionicUser.id).then(rating => {
      $scope.currentRating = rating;
    });

    beeroundService.getBeerCountsByBeer($ionicUser.id, beerId).then(result => {
      $scope.userBeerCount = result[0].count;
    });


    breweryDB.getBeerDetails(beerId).then(result => {
      $ionicLoading.hide();
      $scope.beer = result.data;
      $scope.oldBeerName = $scope.beer.name;
      $scope.beerform = [];
      $scope.beerform.name = $scope.beer.name;
      $stateParams.rating = result.data.rating;


      if ($scope.beer.style === undefined) {
        $scope.beerform.abv = 4.9
      } else {
        $scope.beerform.abv = $scope.beer.style.abvMin;
      }


      breweryDB.getBreweryByBeerId(beerId).then(brewery => {
        $scope.beer.brewery = brewery.data[0].nameShortDisplay;
        $scope.beer.breweryid = brewery.data[0].id;
      });

      beeroundService.postBeer(result.data).then(function (result) {
        console.log(result);
      })
    });

    beeroundService.getComments(beerId).then(function (result) {
      $scope.noComments = false;
      if (result.data.comments.length > 0) {
        $scope.noComments = false;
        $scope.comments = result.data.comments;
      } else {
        $scope.noComments = true;
      }
    });

    $scope.deleteComment = function (commentid) {

      let confirmPopup = $ionicPopup.confirm({
        title: 'Kommentar löschen',
        template: 'Dein Kommentar wird gelöscht! Bist du dir sicher?',
        okText: 'Ok',
        cancelText: 'Abbrechen'
      });

      confirmPopup.then(function (res) {
        if (res) {
          beeroundService.deleteComment(commentid).then(function () {
            beeroundService.getComments(beerId).then(function (result) {
              if (result.data.comments.length > 0) {
                $scope.comments = result.data.comments;
              } else {
                $scope.comments = undefined;
              }
            });
          });


        }
      });
    };


    beeroundService.getCharacteristicsByUser(beerId, $ionicUser.id).then(result => {

      if ((result.sueffig == 0 && result.malzig == 0 && result.herb == 0 && result.erfrischend == 0) || result.sueffig == undefined) {
        $scope.sliderSueffig = {value: 50};
        $scope.sliderMalzig = {value: 50};
        $scope.sliderHerb = {value: 50};
        $scope.sliderErfrischend = {value: 50};
      }
      else {
        $scope.sliderSueffig = {value: result.sueffig};
        $scope.sliderMalzig = {value: result.malzig};
        $scope.sliderHerb = {value: result.herb};
        $scope.sliderErfrischend = {value: result.erfrischend};
      }

    });


    // Characteristics range
    $scope.changeCharacteristicsWindow = function () {
      if ($scope.characteristicsWindow) {
        $scope.characteristicsWindow = false;
      }
      else {
        $scope.characteristicsWindow = true;
      }
    };

    $scope.$on("slideEnded", function () {

      let data = {
        userid: $ionicUser.id,
        beerid: beerId,
        sueffig: $scope.sliderSueffig.value,
        malzig: $scope.sliderMalzig.value,
        herb: $scope.sliderHerb.value,
        erfrischend: $scope.sliderErfrischend.value,
      };

      beeroundService.postCharacteristics(data).then(result => {

        if (result != "put") {
          trophyService.checkCharacteristicsTrophies($ionicUser.id).then(result => {
            if (result != 0) {
              let tmpvar = ' Eigenschaften';
              if (result.step == 1) {
                tmpvar = ' Eigenschaft'
              }
              $rootScope.newTrophy(result.img, result.rank, result.step, 'characteristics')
            }
          });
          console.log("success");
        }
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
          {value: 0, legend: 'wenig'},
          {value: 25},
          {value: 50, legend: '0'},
          {value: 75},
          {value: 100, legend: 'sehr'}
        ],
      },

      optionsmin: {
        floor: 0,
        ceil: 100,
        step: 25,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true,
        stepsArray: [
          {value: 0},
          {value: 25},
          {value: 50},
          {value: 75},
          {value: 100}
        ],
      }

    };

    $scope.positivRating = function () {
      if ($scope.currentRating < 5) {
        $scope.currentRating++;
        sendRating();
        $cordovaVibration.vibrate(30);
      }
    };

    $scope.negativeRating = function () {
      if ($scope.currentRating > 0) {
        $scope.currentRating--;
        sendRating();
        $cordovaVibration.vibrate(30);
      }
    };

    $scope.sendComment = function () {
      if ($scope.form.comment === null || $scope.form.comment === undefined || $scope.form.comment === "" || $scope.form.comment === "null") {
        $state.go('tabs.beerDetails', {beerId: beerId});
      }

      else {
          let data = {
              beerid: beerId,
              userid: $ionicUser.id,
              username: $ionicUser.details.username,
              userimage: $ionicUser.details.image,
              comment: $scope.form.comment
          };

          beeroundService.postComment(data).then(function () {
              trophyService.checkCommentTrophies($ionicUser.id).then(result => {
                if (result != 0) {
                  let tmpvar = ' Kommentare';
                  if (result.step == 1) {
                    tmpvar = ' Kommentar'
                  }
                  $rootScope.newTrophy(result.img, result.rank, result.step, 'comment')
                }

              });

          $scope.form.comment = "";
          $state.go('tabs.beerDetails', {beerId: beerId});

        }, function () {
          // FAIL
          let alertPopup = $ionicPopup.alert({
            title: 'Kommentar fehlgeschlagen!',
          });

          //TODO ERROR HANDLING
        })
      }
    };


    // IMAGE

    //MODAL Image Preview
    $ionicModal.fromTemplateUrl('image-preview.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    // Triggered on a button click, or some other target
    $scope.openActionSheet = function () {

      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          {text: 'Kamera'},
          {text: 'Galerie'}
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.startCamera()
          }
          if (index == 1) {
            $scope.showLibrary();
          }
          return true;
        }
      });

    };

    $scope.showLibrary = function () {
      let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {

        $scope.modal.show();
        $timeout(function () {
          $scope.srcImage = imageURI;
        }, 500);

      }, function (err) {
        let alertPopup = $ionicPopup.alert({
          title: 'Es wurde kein Foto ausgewählt',
        });

      });
    };

    $scope.startCamera = function () {
      let options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {
        $scope.modal.show();

        $timeout(function () {
          $scope.srcImage = imageURI;
        }, 100);

      }, function (err) {

        let alertPopup = $ionicPopup.alert({
          title: 'Du hast den Zugriff verweigert! Es wurde kein Foto gemacht',
        });
      });
    };

    $scope.uploadImage = function () {

      beeroundService.uploadCommentImage($scope.srcImage, beerId, $ionicUser).then(result => {

        $scope.modal.hide();
        $state.go('tabs.beerDetails', {beerId: beerId});


      });
    };

    //RATING

    $scope.logBeer = function () {


      let data = {
        beerid: beerId,
        userid: $ionicUser.id,
        latitude: $rootScope.userSettings.lat,
        longitude: $rootScope.userSettings.lng,
        breweryname: $scope.beer.brewery,
        beername: $scope.beer.nameDisplay

      };

      beeroundService.logBeer(data).then(function () {
        beeroundService.getBeerCountsByBeer($ionicUser.id, beerId).then(result => {
          $scope.userBeerCount = result[0].count;
        });
        // SUCCESS
        trophyService.checkBeerTrophies($ionicUser.id).then(result => {
          if (result != 0) {
            let tmpvar = ' Biere';
            if (result.step == 1) {
              tmpvar = ' Bier'
            }
            $rootScope.newTrophy(result.img, result.rank, result.step, 'beer')
          }
        });

        let confirmPopup = $ionicPopup.confirm({
          title: 'Das Bier wurde deinen Bieren hinzugefügt!',
          template: '<small>Möchtest du das Bier noch bewerten oder ein Bild posten?</small>',
          buttons: [

            {text: 'Zurück'},
            {
              text: 'Bewerten',
              type: 'button-positive',
              onTap: function (e) {
                $state.go('tabs.rateBeer', {beerId: beerId});

              }
            }

          ]
        });

      }, function () {
        // TODO ERROR HANDLING
        console.log("error");
      });

    };

    function sendRating() {
      let data = {
        beerid: beerId,
        userid: $ionicUser.id,
        userimage: $ionicUser.image,
        rating: $scope.currentRating
      };

      beeroundService.sendBeerRating(data).then(result => {
        if (result != "put") {
          trophyService.checkRatingTrophies($ionicUser.id).then(result => {

            if (result != 0) {
              let tmpvar = ' Bewertungen';
              if (result.step == 1) {
                tmpvar = ' Bewertung'
              }
              $rootScope.newTrophy(result.img, result.rank, result.step, 'rating')
            }
          });
        }
      })
    }

    // Show the action sheet to change beer data or delete the beer

    $scope.showOptions = function () {
      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          {text: 'Bier bearbeiten'},
          {text: 'Bier löschen'}
        ],
        titleText: 'Bitte wählen',
        cancelText: 'abbrechen',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            $location.url('/tab/details/beer/' + beerId + '/edit');
          }
          if (index == 1) {
            $scope.deleteBeer();
          }
          return true;
        }
      });

    };

    //Edit the beer with the form + error handling
    $scope.editBeer = function () {
      let data = {
        beerid: beerId,
        styleId: $scope.form.type,
        name: $scope.beerform.name,
        abv: $scope.beerform.abv,
      };

      if ($scope.oldBeerName === $scope.beerform.name) {
        let confirmPopup = $ionicPopup.confirm({
          title: 'Gleicher Name?',
          template: 'Der Name hat sich nicht geändert.',
          okText: 'Ok',
          cancelText: 'Ändern'
        });

        confirmPopup.then(function (res) {
          if (res) {
            if ($scope.form.type === 'noData') {
              $ionicPopup.alert({
                title: 'Bitte wähle die Biersorte!',
              });
            } else {
              breweryDB.putBeerDetails(data);
              let alertPopup = $ionicPopup.alert({
                title: 'Danke für deine Hilfe.',
                template: 'Wir prüfen deine Anfrage und werden das Bier updaten!',
              });
              alertPopup.then(function (res) {
                $location.url('/tab/details/beer/' + beerId);
              });
            }
          }
        });
      } else {
        if ($scope.form.type === 'noData') {
          $ionicPopup.alert({
            title: 'Bitte wähle die Biersorte!',
          });
        } else {
          breweryDB.putBeerDetails(data);
          let alertPopup = $ionicPopup.alert({
            title: 'Danke für deine Hilfe.',
            template: 'Wir prüfen deine Anfrage und werden das Bier updaten!',
          });
          alertPopup.then(function (res) {
            $location.url('/tab/details/beer/' + beerId);
          });
        }

      }
    };

    //Delete the beer with the form + error handling
    $scope.deleteBeer = function () {
      let confirmPopup = $ionicPopup.confirm({
        title: 'Bier löschen',
        template: 'Dieses Bier wird jetzt gelöscht! Bist du dir sicher?',
        okText: 'Ok',
        cancelText: 'Abbrechen'
      });

      confirmPopup.then(function (res) {
        if (res) {

          let data = {
            beerid: beerId,
            userid: $ionicUser.id,
            username: $ionicUser.details.username,
            useremail: $ionicUser.details.email,
            beername: $scope.beer.name,
            url: 'http://api.brewerydb.com/v2/beer/' + beerId + '?key=7802f26125b23378098b3c32911adcce&withLocations=Y'
          };

          beeroundService.deleteBeer(data);

          let alertPopup = $ionicPopup.alert({
            title: 'Danke für deine Hilfe.',
            template: 'Wir prüfen deine Anfrage und werden das Bier löschen, sollte es nicht mehr existieren.',
          });
          alertPopup.then(function (res) {
            $location.url('/tab/details/beer/' + beerId);
          });
        }
      });
    };

  });








