// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in index.js
angular.module('beeround', ['ionic', 'ionic.cloud', 'tabSlideBox', 'ngCordova', 'ngMap', 'google.places', 'beeround.index', 'beeround.beer', 'beeround.account', 'beeround.event', 'breweryDB.service', 'beeround.service','trophies.service', 'angular.filter', 'rzModule', 'chart.js'])
  .run(function ($ionicPlatform, $state, $stateParams, $rootScope, $cordovaLocalNotification, $cordovaGoogleAnalytics, beeroundService, $ionicUser) {
    $ionicPlatform.ready(function () {

      //Google analytics tracking
      $cordovaGoogleAnalytics.startTrackerWithId('UA-101448824-1');
      $cordovaGoogleAnalytics.trackView('tab-list');

      if (window.cordova && window.cordova.plugins.Keyboard) {
        //Change this to false to return accessory bar
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      if($ionicUser.id) {
        beeroundService.logAppStart($ionicUser.id).then(function () {
          // Trophäen hier

        })
      }
    });


    $ionicPlatform.on('resume', function(){

      if($ionicUser.id) {
        beeroundService.logAppStart($ionicUser.id).then(function () {
          // Trophäen hier

        })

      }
    });
  })

  //Create all routes for AngularJS
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicCloudProvider) {
    $stateProvider

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

      .state('tabs.imprint', {
        url: '/company/impressum',
        views: {
          'tab-list': {
            templateUrl: 'templates/company/imprint.html',
            controller: 'breweriesListCtrl'
          }
        }
      })
      .state('tabs.dataprotection', {
        url: '/company/datenschutz',
        views: {
          'tab-list': {
            templateUrl: 'templates/company/dataprotection.html',
            controller: 'breweriesListCtrl'
          }
        }
      })
      .state('tabs.tools', {
        url: '/company/tools',
        views: {
          'tab-list': {
            templateUrl: 'templates/company/tools.html',
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
      .state('tabs.addBeer', {
        url: '/details/beer/:breweryId/add',
        views: {
          'tab-list': {
            templateUrl: 'templates/beer/addBeer.html',
            controller: 'breweriesListCtrl'
          }
        }
      })
      .state('tabs.editBeer', {
        url: '/details/beer/:beerId/edit',
        views: {
          'tab-list': {
            templateUrl: 'templates/beer/editBeer.html',
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
          onEnter: function ($state, $ionicAuth, $ionicUser) {

            if (!$ionicUser.id) {

              $state.transition.finally(() => {
                $state.go('tabs.login')
              });

            }
          }
        }
      })

      .state('tabs.editProfile', {
        url: '/account/editProfile',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/editProfile.html',
            controller: 'profilCtrl'
          }
        },
        onEnter: function ($state, $ionicAuth, $ionicUser) {

          if (!$ionicUser.id) {
            $state.transition.finally(() => {w;
              $state.go('tabs.login')
            });

          }
        }
      })

      .state('tabs.myBeers', {
        url: '/account/myBeers',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/myBeers.html',
            controller: 'myBeersCtrl'
          }
        },
        onEnter: function ($state, $ionicAuth, $ionicUser) {

          if (!$ionicUser.id) {
            $state.transition.finally(() => {
              $state.go('tabs.login')
            });

          }
        }
      })

      .state('tabs.myBeerStory', {
        url: '/account/myBeerStory',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/beerStory.html',
            controller: 'myBeerStoryCtrl'
          }
        },
        onEnter: function ($state, $ionicAuth, $ionicUser) {

          if (!$ionicUser.id) {
            $state.transition.finally(() => {
              $state.go('tabs.login')
            });

          }
        }
      })

      .state('tabs.statistics', {
        url: '/account/statistics',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/statistics.html',
            controller: 'myStatisticsCtrl'
          }
        },
        onEnter: function ($state, $ionicAuth, $ionicUser) {

          if (!$ionicUser.id) {
            $state.transition.finally(() => {
              $state.go('tabs.login')
            });

          }
        }
      })

      .state('tabs.trophies', {
        url: '/account/trophies',
        views: {
          'tab-account': {
            templateUrl: 'templates/account/trophies.html',
            controller: 'myTrophiesCtrl'
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
        onEnter: function ($state, $ionicAuth, $ionicUser) {

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

  .filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function (item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) filtered.reverse();
      return filtered;
    };
  })

  //Password directive for password in register form
  .directive("passwordStrength", function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.passwordStrength, function (value) {
          if (angular.isDefined(value)) {
            if (value.length > 8) {
              scope.strength = "Sicher";
              scope.progressbar = {
                "width": "100%",
                "background-color": "green",
                "border-radius": "10px"
              };
            } else if (value.length > 4) {
              scope.strength = "Nicht so sicher";
              scope.progressbar = {
                "width": "50%",
                "background-color": "orange",
                "border-radius": "10px"
              };
            } else {
              scope.strength = "Unsicher";
              scope.progressbar = {
                "width": "20%",
                "background-color": "red",
                "border-radius": "10px"
              };
            }
          }
        });
      }
    };
  });
