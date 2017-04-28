angular.module('beeround.services', [])
  .service('beerService', ['$http', '$q',
    function ($http, $q) {


      this.getBrewerys = function () {
        return $http.get('http://api.brewerydb.com/v2/locations?postalCode=70173&key=7802f26125b23378098b3c32911adcce').then(function (res) {
          return res.data;
        });
      };
    }

]);
