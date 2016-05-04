var module = angular.module('OrbWeaver');

module.factory('bandsInTownService', function(Auth, $q, $http) {
  var baseUrl = 'http://api.bandsintown.com';
  var distance = '4';
  var appId = 'ORBWEAVER20';

  var now = moment();
  var startDate = moment(now).format('YYYY-MM-DD');
  var endDate = moment(now).add(14, 'days').format('YYYY-MM-DD');
  var venues = [];
  var userLocation = 'Denver, CO';
  //var venueIds = ["2793", "1112651", "29433", "3180634", '1160773', '1068578', '5235', '1058486', '1733440', '746674', '803', '835190', '602147'];
  var venueArtists = [];

  return {
    getEvents: function() {
      var d = $q.defer();
      $http.jsonp(baseUrl + '/events/search.json?' + 'location=' + userLocation + '&radius=' + distance + '&date=' + startDate + ',' + endDate + '&app_id=' + appId + '&per_page=100' + '&callback=JSON_CALLBACK', {

      }).success(function(r){
        d.resolve(r);
      }).error(function(e) {
        d.reject(e);
      });
      return d.promise;
    },
    getBandsByVenues: function(venueIds) {
      var d = $q.defer();
      var promises = [];
      var artistNames = [];
      venueIds.forEach(function(venueId){
        var deferred = $q.defer();
        console.log(baseUrl + '/venues/' + venueId + '/events.json?' + 'app_id=' + appId + '&callback=JSON_CALLBACK');
        $http.jsonp(baseUrl + '/venues/' + venueId + '/events.json?' + 'app_id=' + appId + '&callback=JSON_CALLBACK', {

        }).success(function(r){
          deferred.resolve(r);
        }).error(function(e){
          console.log('getVenues Error', e);
          deferred.resolve(e);
        });
        promises.push(deferred.promise)
      });

      $q.all(promises).then(function(results){
        var endDate = moment().add(14, 'days');
        var now = moment();
        mergedResults = [].concat.apply([], results);
        mergedResults.forEach(function(event){
          if (moment(event.datetime).isBetween(now, endDate)) {
            //artists[0] is so only headliner is included
            artistNames = artistNames.concat(event.artists[0].name);
          }
        });
        //debugger;
        var uniqueArtistNames = _.uniq(artistNames);
        d.resolve(uniqueArtistNames);
      });
      return d.promise;
    },
    getBands: function(userLocation) {
      console.log(userLocation);
      var artistsArray = [];
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

//need to go through all all pages, then loop results through getBands, which checks against list of bands.