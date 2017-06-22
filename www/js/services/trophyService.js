angular.module('trophies.service', [])
  .service('trophyService', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout, beeroundService) {

      return {
        checkCommentTrophies: function (iud, comments) {

        },

        checkRatingTrophies: function (uid) {

          // Get User Activity
          beeroundService.getUserActivities(uid).then(result => {

            let ratings  = result.ratingcount;

            if(ratings == 5){
              return 1
            }
            if(ratings == 15){
              return 2
            }
            if(ratings == 25){
              return 3
            }

            if(ratings == 50){
              return 4
            }
          })

        },

        getTrophies: function (uid) {
          return $http.get('http://www.beeround.de/api/trophies?transform=1&filter=userid,eq,' + uid).then(result => {
            return result.data.trophies;
          })
        },

        createTrophyTable: function (data) {
          return $http.post('http://www.beeround.de/api/trophies', data).then(function (re) {
            return re
          })
        }
      }
  }
  ]);
