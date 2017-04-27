angular.module('beeround.beerlists', [])
  .controller('BeerlistsCtrl', function($scope, beerService) {

    beerService.getBeers();

    $scope.beerlists = [
      { title: 'Augustiner', id: 1 },
      { title: 'Jever', id: 2 },
      { title: 'Radeberger', id: 3 },
      { title: 'Becks', id: 4 },
      { title: 'Heineken', id: 5 }
    ];
  })

  .controller('BeerlistCtrl', function($scope, $stateParams) {
  });
