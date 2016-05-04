var module = angular.module('OrbWeaver');

module.directive('venues', function(){
  return {
    restrict: 'E',
    //scope: {},
    templateUrl: 'partials/venues.html',
    link: function(scope, el, attrs){
      scope.master = {};
      scope.venues = [
        { name: "ogden", selected: false, id: [2793, 1112651] },
        { name: "larimer", selected: false, id: [29433] },
        { name: "bluebird", selected: false, id: [3180634, 1160773] },
        { name: "fillmore", selected: false, id: [602147] },
        { name: "summit", selected: false, id: [1068578] },
        { name: "marquis", selected: false, id: [5235, 1058486] },
        { name: "pepsi", selected: false, id: [1733440] },
        { name: "gothic", selected: false, id: [746674, 803] },
        { name: "firstBank", selected: false, id: [835190] }
      ];

      scope.save = function(venues){
        scope.weave();
        //scope.master = angular.copy(venues);
        //scope.master.forEach(function (venue) {
        //  if (venue.selected) {
        //    console.log(venue)
        //  }
        //})

      };


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

