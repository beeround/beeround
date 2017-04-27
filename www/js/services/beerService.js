angular.module('beeround.services', [])
  .service('beerService', ['$http', '$q',
    function ($http, $q) {


      this.getBeers = function () {
        return $http.get('http://api.brewerydb.com/v2/brewery/iDeqSN/beers?key=7802f26125b23378098b3c32911adcce').then(function (res) {
          return res.data;
        });
      };
    }

]);
