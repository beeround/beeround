angular.module('beeround.services', [])
  .service('beerService', ['$http', '$q',
    function ($http, $q) {


      this.getBrewerys = function () {
        return $http.get('http://api.brewerydb.com/v2/locations?postalCode=70173&key=7802f26125b23378098b3c32911adcce').then(function (res) {
          return res.data;
        });
      };

      this.getBrewerysByPLZ = function (plz) {
        return $http.get('http://api.brewerydb.com/v2/locations?postalCode='+plz+'&key=7802f26125b23378098b3c32911adcce').then(function (res) {
          return res.data;
        });
      };

      this.getBrewerysNearCoordinates = function (lat,lng,radius) {
        return $http.get('http://api.brewerydb.com/v2//search/geo/point?lat='+lat+'&lng='+lng+'&radius='+radius+'&unit=km&key=7802f26125b23378098b3c32911adcce').then(function (res) {
          return res.data;
        });
      };
    }

]);
