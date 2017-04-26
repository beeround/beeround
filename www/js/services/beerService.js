angular
  .module('beeround')
  .service('beerService', ['$http', '$q',
    function ($http, $q) {
      this.getBeers = function () {
        return $http.get('http://api.brewerydb.com/v2/beers?name=Hefeweizen&key=0b5296f4d1049d56ba0ab54663345376').then(function (res) {
          return res.data;
        });
      };
    }

]);
