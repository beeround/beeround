angular.module('breweryDB.service', [])
//Get, post, delete and put data from breweryDB
  .service('breweryDB', ['$http', '$q', '$timeout', 'beeroundService',
    function ($http, $q, $timeout, beeroundService) {

      let breweries;
      let userSettings;

      function getBeers(brewery) {
        return new Promise(function (resolve, reject) {
          $http.get('http://api.brewerydb.com/v2/brewery/' + brewery.brewery.id + '/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
            brewery.beers = res.data.data;
            console.log(res.data.data);
            return resolve(brewery);
          });
        });
      }

      function getRatingByBreweries(breweries) {

        return new Promise(function (resolve, reject) {

          breweries.map((obj, firstIndex) => {

            if (obj.beers) {

              let beerRatingMapping = obj.beers.map((beer, secondIndex) => {
                return beeroundService.getBeerRating(beer.id).then(result => {

                  breweries[firstIndex].beers[secondIndex].rating = result;
                  return beer

                })
              });

              // Save to var and give back, if function has ended
              Promise.all(beerRatingMapping).then(function () {
                resolve(breweries);
              });

            }
          });

        });

      }

      function getRatingByBeers(beers) {

        return new Promise(function (resolve, reject) {

          if (beers) {

            let beerRatingMapping = beers.map((beer, index) => {
              return beeroundService.getBeerRating(beer.id).then(result => {
                beers[index].rating = result;
                return beer

              })
            });

            // Save to var and give back, if function has ended
            Promise.all(beerRatingMapping).then(function () {
              resolve(beers);
            });

          }
        });

      }

      return {

        getBreweriesNearCoordinates: function (clientSettings) {

          if (angular.equals(userSettings, clientSettings)) {
            console.log("Same Filter - loading data localy");

            // TODO Implement Beer request

            return new Promise(function (resolve, reject) {

              // Check, if data is available
              let promises = breweries.map(function (obj) {
                return getBeers(obj).then(result => {
                  return result
                });
              });

              // Save to var and give back, if function has ended
              Promise.all(promises).then(function (results) {
                breweries = results;
                resolve(breweries);
              });

            });
          }
          else {
            // New usersettings, so reload
            userSettings = angular.copy(clientSettings);

            console.log("New Filter - loading data from api");
            return new Promise(function (resolve, reject) {
              $http.get('http://api.brewerydb.com/v2/search/geo/point?lat=' + clientSettings.lat + '&lng=' + clientSettings.lng + '&radius=' + clientSettings.radius + '&unit=km&key=7802f26125b23378098b3c32911adcce').then(function (res) {

                // Check, if data is available
                if (res.data.data) {
                  let promises = res.data.data.map(function (obj) {
                    return getBeers(obj).then(result => {
                      return result
                    });
                  });

                  // Save to var and give back, if function has ended
                  Promise.all(promises).then(function (results) {
                    breweries = results;
                    resolve(breweries);
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
          return $http.get('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
           if(!res.data.data){
             console.log("0");
             return 0;

           }

            return getRatingByBeers(res.data.data).then(result => {
              return result
            });
          });
        },

        getBreweryByBeerId: function (beerId) {

          return $http.get('http://api.brewerydb.com/v2/beer/' + beerId + '/breweries?key=7802f26125b23378098b3c32911adcce&withLocations=Y').then(function (res) {
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

            return beeroundService.getBeerRating(beerId).then(obj => {
              res.data.data.rating = obj.avg_rating;
              res.data.data.ratingCount = obj.rating_count;

              // TODO AVG to default 50
              res.data.data.avgErfrischend = obj.avg_erfrischend;
              res.data.data.avgMalzig = obj.avg_malzig;
              res.data.data.avgSueffig = obj.avg_sueffig;
              res.data.data.avgHerb = obj.avg_herb;
              res.data.data.characteristicsCount = obj.characteristics_count;

              return res.data;
            })
          });
        },

        putBeerDetails: function (data) {
          console.log(data);
          //Biere bearbeiten Funktion wurde aus Testzwecken noch nicht freigeschaltet,
          // da sonst jedes mal eine Abfrage an die breweryDB gesandt wird.
            // $http.put('http://api.brewerydb.com/v2/beer/' + data.beerid + '?key=7802f26125b23378098b3c32911adcce', data).then(result => {
            //    console.log(result);
            // });
        },

        postBeer: function (data) {
          console.log(data);
          //Biere hinzufügen Funktion wurde aus Testzwecken noch nicht freigeschaltet,
          // da sonst jedes mal eine Abfrage an die breweryDB gesandt wird.
            // $http.post('http://api.brewerydb.com/v2/beers?key=7802f26125b23378098b3c32911adcce', data).then(result => {
            //   console.log(result.data);
            // }, err => {
            //   console.log(err);
            // });
        },

        search: function (query) {
          return $http.get('http://api.brewerydb.com/v2/search?q=' + query + '&type=beer&withBreweries=Y&key=7802f26125b23378098b3c32911adcce&withLocations=Y').then(function (res) {
            return res.data;
          });
        }

      }
    }

  ]);
