var module = angular.module('OrbWeaver');

module.factory('bandsInTownService', function(Auth, $q, $http) {
  var baseUrl = 'http://api.bandsintown.com';
  var distance = '4';
  var appId = 'ORBWEAVER20';

  var now = moment();
  var startDate = moment(now).format('YYYY-MM-DD');
  var endDate = moment(now).add(14, 'days').format('YYYY-MM-DD');

  return {
    getEvents: function(userLocation) {
      var d = $q.defer();
      $http.jsonp(baseUrl + '/events/search.json?' + 'location=' + userLocation + '&radius' + distance + '&date=' + startDate + ',' + endDate + '&app_id=' + appId + '&per_page=100' + '&callback=JSON_CALLBACK', {

      }).success(function(r){
        d.resolve(r);
      }).error(function(e) {
        d.reject(e);
      });
      return d.promise;
    },
    getBands: function(userLocation) {
      console.log(userLocation);
      var artistsArray = [];
      var d = $q.defer();
      this.getEvents(userLocation)
      .then(function(r){
          r.forEach(function(event) {
            event.artists.forEach(function (artist) {
              artistsArray.push(artist.name);
            });
          });
          d.resolve(artistsArray);
      }, function(error){
          d.reject(error);
      });
      return d.promise;
    }
  }
});