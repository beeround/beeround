angular.module('beeround.service', [])
  .service('beeroundService', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout) {

      return {
        sendBeerRating: function (data) {

         //data.beerid = "17uR4";
         //data.userid = "12345";

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

        getBreweryEvent: function () {
          return $http.get('http://www.beeround.de/api/events?transform=1').then(result => {
            return result.data;
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

        }
      }
    }
  ]);
