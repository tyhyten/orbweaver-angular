var module = angular.module('OrbWeaver');

module.directive('locationForm', function(userService){
  return {
    restrict: 'E',
    scope: {
      'weave': '&'
    },
    templateUrl: 'partials/location_form.html',
    link: function(scope, el, attrs){
      scope.formLocation = "";
      scope.autocompleteOptions = {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'}
      };
      function formatAddress(googleAddress){
        return googleAddress.formatted_address.replace(', USA', '')
      }
      scope.saveAddress = function(location){
        var userCity = formatAddress(location);
        userService.setUserLocation(userCity);
        console.log('user location set to: ', userService.getUserLocation());
        scope.weave();
      };
    }
  }
});