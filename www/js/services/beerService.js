angular.module('beeround.services', [])
  .service('beerService', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout) {

      let breweries;
      let userSettings;

      function getBeers(brewery) {
        return new Promise(function (resolve, reject) {
          $http.get('http://api.brewerydb.com/v2/brewery/' + brewery.brewery.id + '/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
            brewery.beers = res.data.data;
            return resolve(brewery);
          });
        });
      }

      return {
        getBreweriesNearCoordinates: function (clientSettings) {

          if(angular.equals(userSettings, clientSettings)){
            console.log("Same Filter - loading data localy");

            // TODO Implement Beer request

            return new Promise(function(resolve, reject) {
              resolve(breweries)
            });
          }
          else {
            // New usersettings, so reload
            userSettings = angular.copy(clientSettings);

            console.log("New Filter - loading data from api");
            return new Promise(function (resolve, reject) {
              $http.get('http://api.brewerydb.com/v2/search/geo/point?lat=' + clientSettings.lat + '&lng=' + clientSettings.lng + '&radius=' + clientSettings.radius + '&unit=km&key=7802f26125b23378098b3c32911adcce').then(function (res) {

                // Check, if data is available
                if(res.data.data){
                  let promises = res.data.data.map(function (obj) {
                    return getBeers(obj).then(result => {
                      return result
                    });
                  });

                  // Save to var and give back, if function has ended
                  Promise.all(promises).then(function (results) {
                    breweries = results;
                    resolve(results);
                  });
                }

                else {
                  breweries = undefined;
                  reject()
                }

              });
            });
          }
        },

        getBeersByBrewery: function (breweryId) {
          return $http.get('http://api.brewerydb.com/v2//brewery/' + breweryId + '/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
            return res.data;
          });
        },

        getBreweryById: function (breweryId) {
          return $http.get('http://api.brewerydb.com/v2//brewery/' + breweryId + '?key=7802f26125b23378098b3c32911adcce&withLocations=Y').then(function (res) {
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
