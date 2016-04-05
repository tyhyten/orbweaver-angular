var module = angular.module('OrbWeaver');

module.directive('venues', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'partials/venues.html',
    link: function(scope, el, attrs){
      scope.master = {};
      scope.venues = [
        { name: "ogden", selected: false },
        { name: "larimer", selected: false },
        { name: "bluebird", selected: false },
        { name: "fillmore", selected: false },
        { name: "summit", selected: false },
        { name: "marquis", selected: false },
        { name: "pepsi", selected: false },
        { name: "gothic", selected: false },
        { name: "firstBank", selected: false }
      ];

      scope.save = function(venues){
        scope.master = angular.copy(venues);
      }
    }

  }
});

//ogden - 2793, 1112651
//larimer - 29433
//bluebird theater - 3180634, 1160773
//summit - 1068578
//marquis - 5235, 1058486
//pepsi center - 1733440
//gothic - 746674, 803
//1st Bank - 835190
//fillmore - 602147

