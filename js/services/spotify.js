var module = angular.module('OrbWeaver');

module.factory('spotifyService', function(bandsInTownService, $q, $http, Auth) {
  var baseUrl = 'https://api.spotify.com';
  var now = moment();
  var startDate = moment(now).format('M/DD');
  var endDate = moment(now).add(14, 'days').format('M/DD');

  return {
    getMe: function() {
      var ret = $q.defer();
      $http.get(baseUrl + '/v1/me', {
        headers: {
          'Authorization': 'Bearer ' + Auth.getAccessToken()
        }
      }).success(function(r) {
        console.log('got userinfo', r);
        ret.resolve(r);
      }).error(function(err) {
        console.log('failed to get userinfo', err);
        ret.reject(err);
      });
      return ret.promise;
    },
    getArtistIds: function(artists) {
      var artistsArray = [];
      var d = $q.defer();
      var promises = [];
      artists.forEach(function(artist) {
        var deferred = $q.defer();
          $http.get(baseUrl + '/v1/search?q=' + artist + '&type=artist', {
            headers: {
              'Authorization': 'Bearer ' + Auth.getAccessToken()
            }
          }).success(function(response){
            deferred.resolve(response);
            console.log('getArtistIds: success!')
          }).error(function(err){
            deferred.resolve(err);
            console.log('getArtistIds: error', err);
          });
        promises.push(deferred.promise)
      });

      $q.all(promises).then(function(results){
        results.forEach(function(result) {
          if (result.artists && result.artists.items.length > 0) {
            artistsArray = artistsArray.concat(result.artists.items[0].id);
          }
        });
        d.resolve(artistsArray);
      });
      return d.promise;
    },
    getTopTracks: function(artistIds) {
      var topTracks = [];
      var d = $q.defer();
      var promises = [];
      for (var i = 0; i < artistIds.length; i++) {
        (function(i){
          var d = $q.defer();
          setTimeout(function(){
            $http.get(baseUrl + '/v1/artists/' + artistIds[i] + '/top-tracks' + '?country=US', {}, {
              headers: {
                'Authorization': 'Bearer ' + Auth.getAccessToken()
              }
            }).success(function(response){
              console.log('getTopTracks: success');
              d.resolve(response);
            }).error(function(err){
              d.resolve(err);
              console.log('getTopTracks: error', err);
            });
          }, 200 * i);
          promises.push(d.promise);
        })(i);
      }
      $q.all(promises).then(function(results){
        results.forEach(function(result){
          if (result.tracks && result.tracks.length > 0) {
            topTracks = topTracks.concat(result.tracks[0].uri);
          }
        });
        d.resolve(topTracks);
      });
      return d.promise;
    },
    createPlaylist: function(){
      d = $q.defer();
      $http.post(baseUrl + '/v1/users/' + Auth.getUsername() + '/playlists', { name: "OrbWeaver " + startDate + " - " + endDate }, {
        headers: {
          'Authorization': 'Bearer ' + Auth.getAccessToken()
        }
      }).success(function(r){
        console.log('createPlaylist: success');
        d.resolve(r.id);
      }).error(function(err) {
        console.log('createPlaylist: error', err);
        d.reject(err);
      });
      return d.promise;
    },
    addTracksToPlaylist: function(tracksArray) {
      this.createPlaylist().then(function(response){
        $http.post(baseUrl + '/v1/users/' + Auth.getUsername() + '/playlists/' + response + '/tracks?uris=' + tracksArray.toString(), {}, {
          headers: {
            'Authorization': 'Bearer ' + Auth.getAccessToken()
          }
        }).success(function(r){
          console.log('addTracksToPlaylist: success');
        })
      });
    }
  }
});
