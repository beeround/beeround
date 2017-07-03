angular.module('trophies.service', [])
  .service('trophyService', ['$http', '$q', '$timeout', 'beeroundService',
    function ($http, $q, $timeout, beeroundService) {

      let steps = {
        comment: [
          {
          rank: 1,
          step: 2,
          description: "Du hast zwei Beiträge kommentiert.",
          img: "img/icon_trophies/pencil.png"
        }, {
          rank: 2,
          step: 7,
          img: "img/icon_trophies/pencil.png",
          description: "Du hast sieben Beiträge kommentiert.",

          }, {
          rank: 3,
          step: 12,
          img: "img/icon_trophies/pencil.png",
          description: "Du hast zwölf Beiträge kommentiert.",

          }, {
          rank: 4,
          step: 25,
          img: "img/icon_trophies/pencil.png",
          description: "Du hast 25 Beiträge kommentiert.",

          }, {
          rank: 5,
          step: 50,
          img: "img/icon_trophies/pencil.png",
          description: "Du hast 50 Beiträge kommentiert. Du Tier",

          }],
        characteristics: [
          {
          rank: 1,
          step: 2,
          img: "img/icon_trophies/tester.png",
          description: "Du hast zwei Biere charakterisiert. Bleib dran ;)",

          }, {
          rank: 2,
          step: 7,
          img: "img/icon_trophies/tester.png",
          description: "Du hast sieben Biere charakterisiert.",

          }, {
          rank: 3,
          step: 12,
          img: "img/icon_trophies/tester.png",
          description: "Du hast zwölf Biere charakterisiert.",

          }, {
          rank: 4,
          step: 25,
          img: "img/icon_trophies/tester.png",
          description: "Du hast 25 Biere charakterisiert.",

          }, {
          rank: 5,
          step: 50,
          img: "img/icon_trophies/tester.png",
          description: "Du hast 50 Biere charakterisiert. Nice!",

          }],
        appstart: [
          {
          rank: 1,
          step: 1,
          img: "img/icon_trophies/baby.png",
          description: "Du hast Beeround einmal gestartet.",

          }, {
          rank: 2,
          step: 30,
          img: "img/icon_trophies/baby.png",
          description: "Du hast Beeround bereits 30-mal gestartet.",

          }, {
          rank: 3,
          step: 80,
          img: "img/icon_trophies/baby.png",
          description: "Du hast Beeround bereits 80-mal gestartet.",

          }, {
          rank: 4,
          step: 250,
          img: "img/icon_trophies/baby.png",
            description: "Du hast Beeround bereits 250-mal gestartet.",

          }, {
          rank: 5,
          step: 500,
          img: "img/icon_trophies/baby.png",
          description: "Du bist offiziell Beeround-süchtig! Danke für deinen Support.",

          }],
        event: [
          {
          rank: 1,
          step: 1,
          img: "img/icon_trophies/party.png",
          description: "Du hast ein Event in deinen Kalender eintragen lassen.",

          }, {
          rank: 2,
          step: 3,
          img: "img/icon_trophies/party.png",
            description: "Du hast drei Event in deinen Kalender eintragen lassen.",

          }, {
          rank: 3,
          step: 6,
          img: "img/icon_trophies/party.png",
            description: "Du hast sechs Event in deinen Kalender eintragen lassen.",

          }, {
          rank: 4,
          step: 15,
          img: "img/icon_trophies/party.png",
          description: "Du hast 15 Event in deinen Kalender eintragen lassen.",

          }, {
          rank: 5,
          step: 35,
          img: "img/icon_trophies/party.png",
            description: "Du hast 35 Event in deinen Kalender eintragen lassen. Krasser Partygänger!",

          }],
        contact: [
          {
          rank: 1,
          step: 1,
          img: "img/icon_trophies/contact.png",
          description: "Du hast Kontakt mit einem Veranstalter oder einer Brauerei aufgenommen.",

          }, {
          rank: 2,
          step: 3,
          img: "img/icon_trophies/contact.png",
          description: "Du hast zweimal Kontakt aufgenommen.",

          }, {
          rank: 3,
          step: 6,
          img: "img/icon_trophies/contact.png",
          description: "Du hast sechsmal Kontakt aufgenommen.",

          }, {
          rank: 4,
          step: 15,
          img: "img/icon_trophies/contact.png",
          description: "Du hast 15-mal Kontakt aufgenommen.",

          }, {
          rank: 5,
          step: 35,
          img: "img/icon_trophies/contact.png",
          description: "Hör auf zu nerven!",

          }],
        beer: [
          {
          rank: 1,
          step: 1,
          img: "img/icon_trophies/beerglas.png",
          description: "Du hast dein erstes Bier getrunken. Jeder fängt mal klein an ;)",

          }, {
          rank: 2,
          step: 15,
          img: "img/icon_trophies/beerglas.png",
          description: "15 Biere getrunken! Da ist noch Luft nach oben ;)",

          }, {
          rank: 3,
          step: 40,
          img: "img/icon_trophies/beer.png",
            description: "40 Biere getrunken! Noch 60 bis zum Jubiläum.",

          }, {
          rank: 4,
          step: 100,
          img: "img/icon_trophies/beer.png",
          description: "100 Biere getrunken! Darauf gleich ein Weiteres?!",

          }, {
          rank: 5,
          step: 250,
            img: "img/icon_trophies/barrel.png",
            description: "250 Biere getrunken! Du Alki - aber wir finden es geil!",

          }],
        rating: [
          {
          rank: 1,
          step: 2,
          img: "img/icon_trophies/beginner.png",
          description: "2 Biere bewertet!",

          }, {
          rank: 2,
          step: 5,
            img: "img/icon_trophies/beginner.png",
            description: "5 Biere bewertet!",

          }, {
          rank: 3,
          step: 12,
            img: "img/icon_trophies/beginner.png",
            description: "12 Biere bewertet!",

          }, {
          rank: 4,
          step: 25,
            img: "img/icon_trophies/beginner.png",
            description: "25 Biere bewertet!",

          }, {
          rank: 5,
          step: 50,
            img: "img/icon_trophies/beginner.png",
            description: "50 Biere bewertet! Danke für dein Engagement.",

          }]
      };

      return {
        getDescription: function (type, rang) {
          return new Promise((resolve, reject) => {
            console.log(type);
            resolve(steps[type][rang])
          })
        },
        checkCharacteristicsTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.characteristicscount;

              switch(count) {
                case steps.characteristics[0].step:
                  this.postTrophy(uid, {characteristics: 1}).then(function () {
                    resolve(steps.characteristics[0])
                  });
                  break;
                case steps.characteristics[1].step:
                  this.postTrophy(uid, {characteristics: 2}).then(function () {
                    resolve(steps.characteristics[1])
                  });
                  break;
                case steps.characteristics[2].step:
                  this.postTrophy(uid, {characteristics: 3}).then(function () {
                    resolve(steps.characteristics[2])
                  });
                  break;

                case steps.characteristics[3].step:
                  this.postTrophy(uid, {characteristics: 4}).then(function () {
                    resolve(steps.characteristics[3])
                  });
                  break;

                case steps.characteristics[4].step:
                  this.postTrophy(uid, {characteristics: 5}).then(function () {
                    resolve(steps.characteristics[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkEventTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.eventcount;

              switch(count) {
                case steps.event[0].step:
                  this.postTrophy(uid, {event: 1}).then(function () {
                    resolve(steps.event[0])
                  });
                  break;
                case steps.event[1].step:
                  this.postTrophy(uid, {event: 2}).then(function () {
                    resolve(steps.event[1])
                  });
                  break;
                case steps.event[2].step:
                  this.postTrophy(uid, {event: 3}).then(function () {
                    resolve(steps.event[2])
                  });
                  break;

                case steps.event[3].step:
                  this.postTrophy(uid, {event: 4}).then(function () {
                    resolve(steps.event[3])
                  });
                  break;

                case steps.event[4].step:
                  this.postTrophy(uid, {event: 5}).then(function () {
                    resolve(steps.event[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkAppStartTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.appstartcount;

              switch(count) {
                case steps.appstart[0].step:
                  this.postTrophy(uid, {appstart: 1}).then(function () {
                    resolve(steps.appstart[0])
                  });
                  break;
                case steps.appstart[1].step:
                  this.postTrophy(uid, {appstart: 2}).then(function () {
                    resolve(steps.appstart[1])
                  });
                  break;
                case steps.appstart[2].step:
                  this.postTrophy(uid, {appstart: 3}).then(function () {
                    resolve(steps.appstart[2])
                  });
                  break;

                case steps.appstart[3].step:
                  this.postTrophy(uid, {appstart: 4}).then(function () {
                    resolve(steps.appstart[3])
                  });
                  break;

                case steps.appstart[4].step:
                  this.postTrophy(uid, {appstart: 5}).then(function () {
                    resolve(steps.appstart[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkContactTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.contactcount;

              switch(count) {
                case steps.contact[0].step:
                  this.postTrophy(uid, {contact: 1}).then(function () {
                    resolve(steps.contact[0])
                  });
                  break;
                case steps.contact[1].step:
                  this.postTrophy(uid, {contact: 2}).then(function () {
                    resolve(steps.contact[1])
                  });
                  break;
                case steps.contact[2].step:
                  this.postTrophy(uid, {contact: 3}).then(function () {
                    resolve(steps.contact[2])
                  });
                  break;

                case steps.contact[3].step:
                  this.postTrophy(uid, {contact: 4}).then(function () {
                    resolve(steps.contact[3])
                  });
                  break;

                case steps.contact[4].step:
                  this.postTrophy(uid, {contact: 5}).then(function () {
                    resolve(steps.contact[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkBeerTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.beercount;

              switch(count) {
                case steps.beer[0].step:
                  this.postTrophy(uid, {beer: 1}).then(function () {
                    resolve(steps.beer[0])
                  });
                  break;
                case steps.beer[1].step:
                  this.postTrophy(uid, {beer: 2}).then(function () {
                    resolve(steps.beer[1])
                  });
                  break;
                case steps.beer[2].step:
                  this.postTrophy(uid, {beer: 3}).then(function () {
                    resolve(steps.beer[2])
                  });
                  break;

                case steps.beer[3].step:
                  this.postTrophy(uid, {beer: 4}).then(function () {
                    resolve(steps.beer[3])
                  });
                  break;

                case steps.beer[4].step:
                  this.postTrophy(uid, {beer: 5}).then(function () {
                    resolve(steps.beer[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkCommentTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.commentcount;
              switch(count) {
                case steps.comment[0].step:
                  this.postTrophy(uid, {comment: 1}).then(function () {
                    resolve(steps.comment[0])
                  });
                  break;
                case steps.comment[1].step:
                  this.postTrophy(uid, {comment: 2}).then(function () {
                    resolve(steps.comment[1])
                  });
                  break;
                case steps.comment[2].step:
                  this.postTrophy(uid, {comment: 3}).then(function () {
                    resolve(steps.comment[2])
                  });
                  break;

                case steps.comment[3].step:
                  this.postTrophy(uid, {comment: 4}).then(function () {
                    resolve(steps.comment[3])
                  });
                  break;

                case steps.comment[4].step:
                  this.postTrophy(uid, {comment: 5}).then(function () {
                    resolve(steps.comment[4])
                  });
                  break;
                default:
                  resolve(0)
              }
            })
          });
        },

        checkRatingTrophies: function (uid) {
          return new Promise((resolve, reject) => {
            // Get User Activity
            beeroundService.getUserActivities(uid).then(result => {

              let count  = result.ratingcount;

              switch(count) {
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

                case steps.rating[4].step:
                  this.postTrophy(uid, {rating: 5}).then(function () {
                    resolve(steps.rating[4])
                  });
                  break;
                default:
                  resolve(0)
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
