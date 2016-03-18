var module = angular.module('OrbWeaver');

module.directive('venues', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'partials/venues.html',
    link: function(scope, el, attrs){
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

      scope.save = function(){
        console.log(scope.venues)
      }
    }

  }
});