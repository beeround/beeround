angular.module('beeround.service', [])
  .service('beeroundService', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout) {

      return {
        sendBeerRating: function (data) {
          $http.post('http://beeround.de/api/comments?transform=1', data).then(result => {

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

        }
      }
    }
  ]);
