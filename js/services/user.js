var module = angular.module('OrbWeaver');

module.factory('userService', function() {
  var userLocation = "";
  var userPhoto = "";
  return {
    setUserLocation: function(location){
      userLocation = location;
    },
    getUserLocation: function(){
      return userLocation;
    },
    setUserImage: function(url){
      userPhoto = url;
    },
    getUserImage: function(){
      return userPhoto;
    }
  }
});
