// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in index.js
angular.module('beeround', ['ionic','ionic.cloud','tabSlideBox','ngCordova','ngMap', 'google.places','beeround.index', 'beeround.beer', 'beeround.account', 'beeround.event', 'breweryDB.service', 'beeround.service', 'angular.filter', 'rzModule']);
angular.module('beeround', ['ionic','ionic.cloud','tabSlideBox','ngCordova','ngMap', 'google.places','beeround.index', 'beeround.beer', 'beeround.account', 'beeround.event', 'breweryDB.service', 'beeround.service', 'angular.filter', 'rzModule'])
.run(function($ionicPlatform, $state, $stateParams, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(window.cordova && window.cordova.plugins.Keyboard) {
      //Change this to false to return accessory bar
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicCloudProvider) {
  $stateProvider

  /*.state('statistics', {
      url: '/statistics',
      templateUrl: 'templates/account/statistics.html'
    })*/
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.breweryList', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/listSlider.html',
          controller: 'breweriesListCtrl'
        }
      }
    })
    .state('tabs.breweryDetails', {
      url: '/list/:brewery',
      views: {
        'tab-list': {
          templateUrl: 'templates/brewery/breweryDetails.html',
          controller: 'beerListCtrl'
        }
      }
    })
    .state('tabs.beerDetails', {
      url: '/details/beer/:beerId',
      views: {
        'tab-list': {
          templateUrl: 'templates/beer/beerDetails.html',
          controller: 'beerDetailsCtrl'
        }
      }
    })
    .state('tabs.eventDetails', {
      url: '/details/event/:id',
      views: {
        'tab-list': {
          templateUrl: 'templates/event/eventDetails.html',
          controller: 'eventDetailsCtrl'
        }
      }
    })
    .state('tabs.rateBeer', {
      url: '/details/beer/:beerId/rate',
      views: {
        'tab-list': {
          templateUrl: 'templates/beer/rateBeer.html',
          controller: 'beerDetailsCtrl'
        }
      }
    })
    .state('tabs.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/mapView.html',
          controller: 'mapCtrl'
        }
      }
    })
    .state('tabs.signup', {
      url: '/account/signup',
      views: {
        'tab-account': {
          templateUrl: 'templates/account/signup.html',
          controller: 'signUpCtrl'
        }
      }
    })
    .state('tabs.profile', {
      url: '/account/profile',
      views: {
        'tab-account': {
          templateUrl: 'templates/account/profile.html',
          controller: 'profilCtrl'
        },
        onEnter: function($state, $ionicAuth, $ionicUser){

          if (!$ionicUser.id) {

            $state.transition.finally(() => {
              $state.go('tabs.login')
            });

          }
        }
      }})

      .state('tabs.editProfile', {
          url: '/account/editProfile',
          views: {
              'tab-account': {
                  templateUrl: 'templates/account/editProfile.html',
                  controller: 'profilCtrl'
              }
          },
        onEnter: function($state, $ionicAuth, $ionicUser){

          if (!$ionicUser.id) {
            $state.transition.finally(() => {
              $state.go('tabs.login')
            });

          }
        }
      })

    .state('tabs.login', {
      url: '/account/login',
      views: {
        'tab-account': {
          templateUrl: 'templates/account/login.html',
          controller: 'loginCtrl',

        }
      },
      onEnter: function($state, $ionicAuth, $ionicUser){

        if ($ionicUser.id) {

          $state.transition.finally(() => {
            $state.go('tabs.profile')
          });

        }
      }
    })

  ;


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/list');

  $ionicConfigProvider.tabs.position('bottom');

  $ionicCloudProvider.init({
    "core": {
      "app_id": "9b8ef8c6"
    }

  });

})

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.directive("passwordStrength", function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      scope.$watch(attrs.passwordStrength, function(value) {
        if(angular.isDefined(value)){
          if (value.length > 8) {
            scope.strength = "Sicher";
            scope.progressbar = {
                "width" : "100%",
                "background-color" : "green",
                "border-radius" : "10px"
            };
          } else if (value.length > 4) {
            scope.strength = "Nicht so sicher";
            scope.progressbar = {
              "width" : "50%",
              "background-color" : "orange",
              "border-radius" : "10px"
            };
          } else {
            scope.strength = "Unsicher";
            scope.progressbar = {
              "width" : "20%",
              "background-color" : "red",
              "border-radius" : "10px"
            };
          }
        }
      });
    }
  };
});
