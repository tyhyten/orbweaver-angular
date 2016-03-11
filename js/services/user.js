var module = angular.module('OrbWeaver');

module.factory('userService', function() {
  var userLocation = "";
  return {
    setUserLocation: function(location){
      userLocation = location;
    },
    getUserLocation: function(){
      return userLocation;
    }
  }
});
