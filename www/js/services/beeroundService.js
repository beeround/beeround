angular.module('beeround.service', [])
  .service('beeroundService', ['$http', '$q', '$timeout', '$cordovaFileTransfer', 'trophyService',
    function ($http, $q, $timeout, $cordovaFileTransfer, trophyService) {

      return {
        sendBeerRating: function (data) {

          return $http.get('http://www.beeround.de/api/ratings?transform=1&filter[]=beerid,eq,' + data.beerid + '&filter[]=userid,eq,' + data.userid + '&satisfy=all').then(result => {

            //TODO DELETE IF 0
            if (result.data.ratings.length > 0) {
              console.log("Data available");

              $http.put('http://www.beeround.de/api/ratings/' + result.data.ratings[0].ratingid, data).then(result => {
                console.log("PUT: " + result);

              });

            }
            else {
              console.log("No DATA");
              console.log(data);
              $http.post('http://www.beeround.de/api/ratings', data).then(result => {
                console.log("POST: " + result.data);
              });
            }
          })
        },

        getBeerRating: function (beerID) {
          return $http.get('http://www.beeround.de/api/beers?transform=1&filter=beers.beerid,eq,' + beerID).then(result => {

            if (result.data.beers[0]) {
              return result.data.beers[0];
            }

            else {
              return 0
            }
          })
        },

        getBeerRatingByBrewerielist: function (breweries) {
          return new Promise(function (resolve, reject) {

            breweries.map((obj, firstIndex) => {

              if (obj.beers) {

                let beerRatingMapping = obj.beers.map((beer, secondIndex) => {
                  return $http.get('http://www.beeround.de/api/beers?transform=1&filter=beers.beerid,eq,' + beer.id).then(result => {

                    if (result.data.beers[0]) {
                      breweries[firstIndex].beers[secondIndex].rating = result.data.beers[0].avg_rating;
                      breweries[firstIndex].beers[secondIndex].sueffig = result.data.beers[0].avg_sueffig;
                      breweries[firstIndex].beers[secondIndex].malzig = result.data.beers[0].avg_malzig;
                      breweries[firstIndex].beers[secondIndex].herb = result.data.beers[0].avg_herb;
                      breweries[firstIndex].beers[secondIndex].erfrischend = result.data.beers[0].avg_erfrischend;

                      return beer

                    }


                    else {
                      breweries[firstIndex].beers[secondIndex].rating = 0;
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
          return $http.get('http://www.beeround.de/getevents.php?longitude=' + userdata.lng + '&latitude=' + userdata.lat + '&radius=' + userdata.radius).then(result => {
            return result.data;
          })
        },

        getEventDetail: function (eventid) {
          return $http.get('http://www.beeround.de/api/events?transform=1&filter=events.id,eq,' + eventid).then(result => {
            console.log(result.data['events'][0]);
            return result.data['events'][0];
          })
        },

        getEventByBrewery: function (breweryId) {
          return $http.get('http://www.beeround.de/api/events?transform=1&filter=breweryid,eq,' + breweryId).then(result => {
            console.log(result.data['events']);
            return result.data['events'];
          })
        },

        getRatingByUser: function (bID, uID) {
          return $http.get('http://www.beeround.de/api/ratings?transform=1&filter[]=beerid,eq,' + bID + '&filter[]=userid,eq,' + uID + '&satisfy=all').then(result => {

            if (result.data.ratings.length > 0) {
              return result.data.ratings[0].rating

            }
            else {
              return 0
            }
          })
        },

        postBeer: function (beer) {

          let data = {
            beerid: beer.id,
            beername: beer.nameDisplay,
            breweryid: 1
            //TODO REMOVE breweryid in DB

          };

          return $http.post('http://www.beeround.de/api/beers?transform=1', data).then(result => {
            console.log("POST: " + result.data);
            return result.data;
          });

        },

        getComments: function (bID) {
          return $http.get('http://www.beeround.de/api/comments?transform=1&order=commentcreated,DESC&filter[]=beerid,eq,' + bID).then(result => {
            return result;
          });
        },

        postComment: function (data) {
          return $http.post('http://www.beeround.de/api/comments', data).then(result => {
            return result;
          });
        },

        getCharacteristicsByUser: function (bID, uID) {
          return $http.get('http://www.beeround.de/api/characteristics?transform=1&filter[]=beerid,eq,' + bID + '&filter[]=userid,eq,' + uID + '&satisfy=all').then(result => {

            if (result.data.characteristics.length > 0) {
              return result.data.characteristics[0]
            }
            else {
              return 0
            }
          })
        },

        postCharacteristics: function (data) {

          return $http.get('http://www.beeround.de/api/characteristics?transform=1&filter[]=beerid,eq,' + data.beerid + '&filter[]=userid,eq,' + data.userid + '&satisfy=all').then(result => {

            if (result.data.characteristics.length > 0) {
              console.log("Data available");

              $http.put('http://www.beeround.de/api/characteristics/' + result.data.characteristics[0].characteristicsid, data).then(result => {
                console.log("PUT: " + result);

              });

            }
            else {
              console.log("No DATA");
              console.log(data);
              $http.post('http://www.beeround.de/api/characteristics', data).then(result => {
                console.log("POST: " + result.data);
              });
            }

          });

        },

        postBeerImage: function (data) {
          return $http.post('http://www.beeround.de/api/comments', data).then(result => {
            return result;
          });
        },

        uploadImage: function (path) {

          return new Promise((resolve, reject) => {

            // Destination URL
            let url = "http://beeround.domi-speh.de/upload.php";

            // File for Upload
            let targetPath = path;

            let options = {
              fileKey: "file",
              fileName: "profile" + new Date().getTime(),
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params: {'fileName': "profile" + new Date().getTime()}
            };


            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
              let imagePath = "http://beeround.domi-speh.de/uploads/" + options.fileName;
              resolve(imagePath)


            }, function () {
              reject("error")
            });

          });

        },

        updateImage: function (img, uid) {
          let imageData = {
            userid: uid ,
            url: img
          };

          return $http.post('http://www.beeround.de/api/changeuserimage', data).then(function () {
            console.log("hi")
            }
          ), function (err) {
            return err
          };
        },

        logBeer: function (data) {
          return $http.post('http://www.beeround.de/api/drinkinghabits', data).then(result => {
            console.log("POST: " + result.data);
          });
        },

        getBeerStory: function (uid) {

          return $http.get('http://www.beeround.de/api/drinkinghabits?transform=1&order=drinkinghabitid,DESC&filter=userid,eq,' + uid).then(result => {
            return result.data.drinkinghabits;
          })
        },

        deleteBeer: function (data) {
          return $http.post('http://www.beeround.de/api/delete', data).then(result => {
            console.log("POST: " + result.data);
          });
        },

        getBeerCounts: function (uid) {
          return $http.get('http://www.beeround.de/api/drinkingstatistics?transform=1&order=count,DESC&filter=userid,eq,' + uid).then(result => {
            return result.data.drinkingstatistics;
          })
        },

        getBeerDataByMonth: function (uid, timestamp, value) {

          let month = (timestamp.getMonth()+1-value);
          if(month < 1)
          {
            month = month + 12
          }
          if(month < 10){
            month = '0'+month
          }
          let year = (timestamp.getYear()+1900);
          timestamp = year+'-'+month;
          return $http.get('http://www.beeround.de/api/drinkinghabits?transform=1&filter[]=userid,eq,'+uid+'&filter[]=timestamp,cs,'+timestamp).then(result => {
            return result.data.drinkinghabits.length;

          })
        },

        postLogin: function (uid) {
          let data = {
            userid: uid
          };

          return $http.post('http://www.beeround.de/api/loginstatistics', data).then(result => {

            trophyService.createTrophyTable(data).then(function (re) {
              return result;

            });
          });
        },

        postContact: function (uid) {
          let data = {
            userid: uid
          };

          return $http.post('http://www.beeround.de/api/contacted', data).then(result => {
            return result;
          });
        },

        postEvent: function (uid) {
          let data = {
            userid: uid
          };

          return $http.post('http://www.beeround.de/api/eventdownloads', data).then(result => {
            return result;
          });
        },


        getUserActivities: function (uid) {
          return $http.get('http://www.beeround.de/api.php/activities?transform=1&filter=userid,eq,' + uid).then(result => {
            return result.data.activities[0];
          })
        }

      }
  }
  ]);
