// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in index.js
angular.module('beeround', ['ionic','ngCordova', 'google.places','beeround.index', 'beeround.beer', 'beeround.services'])
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html'
  })
  .state('statistics', {
      url: '/statistics',
      templateUrl: 'templates/statistics.html'
    })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.breweryList', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/listBreweries.html',
          controller: 'breweriesListCtrl'
        }
      }
    })
    .state('tabs.beerList', {
      url: '/list/:brewery',
      views: {
        'tab-list': {
          templateUrl: 'templates/listBeers.html',
          controller: 'beerListCtrl'
        }
      }
    })
    .state('tabs.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/mapView.html',
          controller: 'breweriesListCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/list');

  $ionicConfigProvider.tabs.position('bottom');

});

