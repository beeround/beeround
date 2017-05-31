// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in index.js
angular.module('beeround', ['ionic','ionic.cloud','tabSlideBox','ngCordova','ngMap', 'google.places','beeround.index', 'beeround.beer', 'beeround.account', 'breweryDB.service', 'beeround.service', 'angular.filter'])
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

  .state('statistics', {
      url: '/statistics',
      templateUrl: 'templates/account/statistics.html'
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
    .state('tabs.login', {
      url: '/account/login',
      views: {
        'tab-account': {
          templateUrl: 'templates/account/login.html',
          controller: 'loginCtrl',

        }
      },
      onEnter: function($state, $ionicUser){

        if($ionicUser.id) {
          $state.go('tabs.profile')
        }
      }
    })
    .state('tabs.profile', {
      url: '/account/profile',
      views: {
        'tab-account': {
          templateUrl: 'templates/account/profile.html',
          controller: 'profilCtrl'
        }
      }});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/list');

  $ionicConfigProvider.tabs.position('bottom');

  $ionicCloudProvider.init({
    "core": {
      "app_id": "9b8ef8c6"
    }

  });

})

.directive("passwordStrength", function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      scope.$watch(attrs.passwordStrength, function(value) {
        if(angular.isDefined(value)){
          if (value.length > 8) {
            scope.strength = 'perfekt';
          } else if (value.length > 3) {
            scope.strength = 'nur mittel gut.';
          } else {
            scope.strength = 'zu schwach';
          }
        }
      });
    }
  };
});
