var module = angular.module('OrbWeaver');

module.factory('bandsInTownService', function(Auth, $q, $http) {
  var baseUrl = 'http://api.bandsintown.com';
  var location =  'Denver,CO';
  var distance = '15';
  var appId = 'ORBWEAVER20';

  var now = moment();
  var startDate = moment(now).add(8, 'days').format('YYYY-MM-DD');
  var endDate = moment(now).add(16, 'days').format('YYYY-MM-DD');

  return {
    getEvents: function() {
      var d = $q.defer();
      $http.jsonp(baseUrl + '/events/search.json?' + 'location=' + location + '&radius' + distance + '&date=' + startDate + ',' + endDate + '&app_id=' + appId + '&callback=JSON_CALLBACK', {

      }).success(function(r){
        d.resolve(r);
      }).error(function(e) {
        d.reject(e);
      });
      return d.promise;
    },
    getBands: function() {
      artistsArray = [];
      var d = $q.defer();
      this.getEvents()
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