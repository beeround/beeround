angular.module('beeround.services', [])
  .service('beerService', ['$http', '$q',
    function ($http, $q) {

      let breweries;
      let userSettings;

      return {

        getBreweriesNearCoordinates: function (clientSettings) {

          if(angular.equals(userSettings, clientSettings)){
            console.log("Same settings");

            // TODO Implement Beer request

            return new Promise(function(resolve, reject) {
              resolve(breweries)
            });
          }
          else {
            // New usersettings, so reload
            userSettings = angular.copy(clientSettings);
            console.log("New Usersettings");

            return $http.get('http://api.brewerydb.com/v2//search/geo/point?lat=' + clientSettings.lat + '&lng=' + clientSettings.lng + '&radius=' + clientSettings.radius + '&unit=km&key=7802f26125b23378098b3c32911adcce').then(function (res) {
              breweries = res.data;
              return res.data;
            });
          }
        },

        getBeersByBrewery: function (breweryId) {
          return $http.get('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
            return res.data;
          });
        },

        getBreweryById: function (breweryId) {
          return $http.get('http://api.brewerydb.com/v2/brewery/' + breweryId + '?key=7802f26125b23378098b3c32911adcce&withLocations=Y').then(function (res) {
            return res.data;
          });
        },

        getBeerDetails: function (beerId) {
          return $http.get('http://api.brewerydb.com/v2/beer/' + beerId + '?key=7802f26125b23378098b3c32911adcce&withLocations=Y').then(function (res) {
            return res.data;
          });
        }
      }
    }

  ]);
