angular.module('beeround.beer', [])
  .controller('listCtrl', function($scope, beerService) {

    beerService.getBeers().then(result => {
      $scope.beerlist = result.data;
    });
  });
