var module = angular.module('OrbWeaver');

module.factory('spotifyService', function(bandsInTownService, $q, $http, Auth, $window) {
  var baseUrl = 'https://api.spotify.com';
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  var startDate = function(){
    var date = new Date();
    return formatDate(date.setDate(date.getDate() + 8))
  };
  startDate();

  return {
    getArtistIds: function(artists) {
      var artistsArray = [];
      var d = $q.defer();
      var promises = [];
      artists.forEach(function(artist) {
        promises.push(
          $http.get(baseUrl + '/v1/search?q=' + artist + '&type=artist', {
            headers: {
              'Authorization': 'Bearer ' + Auth.getAccessToken()
            }
          }).success(function(){
            console.log('getArtistIds: success!')
          }).error(function(err){
            console.log('getArtistIds: error', err);
          })
        )
      });
      $q.all(promises).then(function(results){
        results.forEach(function(result) {
          if (result.data.artists.items.length > 0) {
            artistsArray = artistsArray.concat(result.data.artists.items[0].id);
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
            $http.get(baseUrl + '/v1/artists/' + artistIds[i] + '/top-tracks' + '?country=US', {
              headers: {
                'Authorization': 'Bearer ' + Auth.getAccessToken()
              }
            }).success(function(response){
              console.log('getTopTracks: success');
              d.resolve(response);
            }).error(function(err){
              d.resolve(err);
              console.log('getTopTracks: error');
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
      $http.post(baseUrl + '/v1/users/' + Auth.getUsername() + '/playlists', { name: "OrbWeaver Playlist " }, {
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

//we need to get artists ID's for all of the bandsInTownArtists v
//we need to search "https://api.spotify.com/v1/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin" v
//we need to take those artists and hit the top tracks end point v
//we need to take those top tracks and create a playlist in the user's account v
//We need to get artists that will be in town next week
// Filter by venue?

