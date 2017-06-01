angular.module('beeround.service', [])
  .service('beeroundService', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout) {

      return {
        sendBeerRating: function (data) {

          return $http.get('http://www.beeround.de/api/ratings?transform=1&filter[]=beerid,eq,'+data.beerid+'&filter[]=userid,eq,'+data.userid+'&satisfy=all').then(result => {

            if(result.data.ratings.length > 0){
              console.log("Data available");

              $http.put('http://www.beeround.de/api/ratings/'+result.data.ratings[0].ratingid, data).then(result => {
                console.log("PUT: "+result);

              });

            }
            else {
              console.log("No DATA");
              console.log(data);
              $http.post('http://www.beeround.de/api/ratings', data).then(result => {
                console.log("POST: "+result.data);
              });
            }
          })
        },

        getBeerRating: function (beerID) {
          return $http.get('http://www.beeround.de/api/beers?transform=1&filter=beers.beerid,eq,'+beerID).then(result => {

            if(result.data.beers[0]){
              return result.data.beers[0].avg_rating;
            }

            else {
              return 0
            }

          })

        },

        getBeerRatingByBrewerielist: function(breweries){
          return new Promise(function (resolve, reject) {

            breweries.map((obj, firstIndex) => {

              if(obj.beers){

                let beerRatingMapping = obj.beers.map((beer,secondIndex)=> {
                  return $http.get('http://www.beeround.de/api/beers?transform=1&filter=beers.beerid,eq,'+beer.id).then(result => {

                    if(result.data.beers[0]){
                      breweries[firstIndex].beers[secondIndex].rating = result.data.beers[0].avg_rating;
                      return beer
                    }

                    else {
                      return 0
                    }

                  });

                });

                // Save to var and give back, if function has ended
                Promise.all(beerRatingMapping).then(function () {
                  console.log("Brewery");
                  resolve(breweries);
                });

              }
            });

          });
        },

        getBreweryEvent: function (userdata) {
          return $http.get('http://www.beeround.de/getevents.php?longitude='+userdata.lng+'&latitude='+userdata.lat+'&radius='+userdata.radius).then(result => {
            return result.data;
          })
        },

        getEventDetail: function (eventid) {
          return $http.get('http://www.beeround.de/api/events?transform=1&filter=events.id,eq,'+eventid).then(result => {
            console.log(result.data['events'][0]);
            return result.data['events'][0];
          })
        },

        getEventByBrewery: function (breweryId) {
          return $http.get('http://www.beeround.de/api/events?transform=1&filter=breweryid,eq,'+breweryId).then(result => {
            console.log(result.data['events']);
            return result.data['events'];
          })
        },

        getRatingByUser: function (bID, uID) {
          return $http.get('http://www.beeround.de/api/ratings?transform=1&filter[]=beerid,eq,'+bID+'&filter[]=userid,eq,'+uID+'&satisfy=all').then(result => {

            if(result.data.ratings.length > 0){
             return result.data.ratings[0].rating

            }
            else {
              return 0
            }
          })
        },

        postBeer: function (beer) {

          let data = {
            beerid : beer.id,
            beername: beer.nameDisplay,
            breweryid: 1
            //TODO REMOVE breweryid in DB

          };

          return $http.post('http://www.beeround.de/api/beers?transform=1', data).then(result => {
            console.log("POST: "+result.data);
            return result.data;
          });

        },

        getComments : function (bID) {
            return $http.get('http://www.beeround.de/api/comments?transform=1&order=commentcreated,DESC&filter[]=beerid,eq,'+bID).then(result => {
              return result;
            });
        },

        postComment : function (data) {
          return $http.post('http://www.beeround.de/api/comments', data).then(result => {
            return result;
          });
        },

        getCharacteristicsByUser: function (bID, uID) {
          return $http.get('http://www.beeround.de/api/characteristics?transform=1&filter[]=beerid,eq,'+bID+'&filter[]=userid,eq,'+uID+'&satisfy=all').then(result => {

            if(result.data.characteristics.length > 0){
              return result.data.characteristics[0]
            }
            else {
              return 0
            }
          })
        },

        postCharacteristics: function (data) {

          return $http.get('http://www.beeround.de/api/characteristics?transform=1&filter[]=beerid,eq,'+data.beerid+'&filter[]=userid,eq,'+data.userid+'&satisfy=all').then(result => {

            if(result.data.characteristics.length > 0){
              console.log("Data available");

              $http.put('http://www.beeround.de/api/characteristics/'+result.data.characteristics[0].characteristicsid, data).then(result => {
                console.log("PUT: "+result);

              });

            }
            else {
              console.log("No DATA");
              console.log(data);
              $http.post('http://www.beeround.de/api/characteristics', data).then(result => {
                console.log("POST: "+result.data);
              });
            }

          });

        }
      }
    }
  ]);
