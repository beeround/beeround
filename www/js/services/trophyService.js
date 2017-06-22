angular.module('trophies.service', [])
  .service('trophyService', ['$http', '$q', '$timeout', 'beeroundService',
    function ($http, $q, $timeout, beeroundService) {

      let steps = {
        comment: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / pencil.png"
        }, {
          rank: 2,
          step: 5,
          img: ".. / .. / img / icon_trophies / pencil.png"
        }, {
          rank: 3,
          step: 12,
          img: ".. / .. / img / icon_trophies / pencil.png"
        }, {
          rank: 4,
          step: 25,
          img: ".. / .. / img / icon_trophies / pencil.png"
        }, {
          rank: 5,
          step: 50,
          img: ".. / .. / img / icon_trophies / pencil.png"
        }],
        characteristics: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / tester.png"
        }, {
          rank: 2,
          step: 5,
          img: ".. / .. / img / icon_trophies / tester.png"
        }, {
          rank: 3,
          step: 12,
          img: ".. / .. / img / icon_trophies / tester.png"
        }, {
          rank: 4,
          step: 25,
          img: ".. / .. / img / icon_trophies / tester.png"
        }, {
          rank: 5,
          step: 50,
          img: ".. / .. / img / icon_trophies / tester.png"
        }],
        appstart: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / baby.png"
        }, {
          rank: 2,
          step: 30,
          img: ".. / .. / img / icon_trophies / baby.png"
        }, {
          rank: 3,
          step: 40,
          img: ".. / .. / img / icon_trophies / baby.png"
        }, {
          rank: 4,
          step: 250,
          img: ".. / .. / img / icon_trophies / baby.png"
        }, {
          rank: 5,
          step: 500,
          img: ".. / .. / img / icon_trophies / baby.png"
        }],
        event: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / party.png"
        }, {
          rank: 2,
          step: 3,
          img: ".. / .. / img / icon_trophies / party.png"
        }, {
          rank: 3,
          step: 6,
          img: ".. / .. / img / icon_trophies / party.png"
        }, {
          rank: 4,
          step: 15,
          img: ".. / .. / img / icon_trophies / party.png"
        }, {
          rank: 5,
          step: 35,
          img: ".. / .. / img / icon_trophies / party.png"
        }],
        contact: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / contact.png"
        }, {
          rank: 2,
          step: 3,
          img: ".. / .. / img / icon_trophies / contact.png"
        }, {
          rank: 3,
          step: 6,
          img: ".. / .. / img / icon_trophies / contact.png"
        }, {
          rank: 4,
          step: 15,
          img: ".. / .. / img / icon_trophies / contact.png"
        }, {
          rank: 5,
          step: 35,
          img: ".. / .. / img / icon_trophies / contact.png"
        }],
        beer: [
          {
          rank: 1,
          step: 1,
          img: ".. / .. / img / icon_trophies / beerglas.png"
        }, {
          rank: 2,
          step: 15,
          img: ".. / .. / img / icon_trophies / beerglas.png"
        }, {
          rank: 3,
          step: 40,
          img: ".. / .. / img / icon_trophies / beer.png"
        }, {
          rank: 4,
          step: 100,
          img: ".. / .. / img / icon_trophies / beer.png"
        }, {
          rank: 5,
          step: 250,
          img: ".. / .. / img / icon_trophies / barrel.png"
        }],
        rating: [
          {
          rank: 1,
          step: 1,
          img: "../../img/icon_trophies/beginner.png"
        }, {
          rank: 2,
          step: 5,
          img: ".. / .. / img / icon_trophies / beginner.png"
        }, {
          rank: 3,
          step: 12,
          img: ".. / .. / img / icon_trophies / beginner.png"
        }, {
          rank: 4,
          step: 25,
          img: ".. / .. / img / icon_trophies / beginner.png"
        }, {
          rank: 5,
          step: 50,
          img: ".. / .. / img / icon_trophies / beginner.png"
        }]
      };

      return {
        checkCommentTrophies: function (iud, comments) {

        },

        checkRatingTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let ratings  = result.ratingcount;

              switch(ratings) {
                case steps.rating[0].step:
                  this.postTrophy(uid, {rating: 1}).then(function () {
                    resolve(steps.rating[0])
                  });
                  break;
                case steps.rating[1].step:
                  this.postTrophy(uid, {rating: 2}).then(function () {
                    resolve(steps.rating[1])
                  });
                  break;
                case steps.rating[2].step:
                  this.postTrophy(uid, {rating: 3}).then(function () {
                    resolve(steps.rating[2])
                  });
                  break;

                case steps.rating[3].step:
                  this.postTrophy(uid, {rating: 4}).then(function () {
                    resolve(steps.rating[3])
                  });
                  break;
                default:
                  resolve(steps.rating[0])
              }
            })
          });

        },

        getTrophies: function (uid) {
          return $http.get('http://www.beeround.de/api/trophies?transform=1&filter=userid,eq,' + uid).then(result => {
            return result.data.trophies;
          })
        },

        postTrophy : function (uid, data) {
          return $http.put('http://www.beeround.de/api/trophies/' + uid, data);
        },

        createTrophyTable: function (data) {
          return $http.post('http://www.beeround.de/api/trophies', data).then(function (re) {
            return re
          })
        }
      }
  }
  ]);
