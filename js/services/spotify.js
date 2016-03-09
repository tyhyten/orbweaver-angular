var module = angular.module('OrbWeaver');

module.factory('spotifyService', function(bandsInTownService, $q, $http, Auth, $window) {
  var baseUrl = 'https://api.spotify.com';

  return {
    //getArtistIds: function() {
    //  var artistsArray = [];
    //  var d = $q.defer();
    //  bandsInTownArtists.forEach(function(artist) {
    //    $http.get(baseUrl + '/v1/search?q=' + artist + '&type=artist', {
    //
    //    }).success(function(r) {
    //      artistsArray.push(r.artists.items[0].id);
    //      //d.resolve(artistsArray);
    //    }).error(function(e) {
    //      console.log("couldn't find " + artist)
    //    });
    //  });
    //  d.resolve(artistsArray);
    //  return d.promise;
    //},
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
          setTimeout(function(){
            $http.get(baseUrl + '/v1/artists/' + artistIds[i] + '/top-tracks' + '?country=US', {
              headers: {
                'Authorization': 'Bearer ' + Auth.getAccessToken()
              }
            }).success(function(response){
              console.log('potsticker');
              topTracks.push(response.tracks)
            });
            if (i == artistIds.length - 1) {
              d.resolve(topTracks);
            }
          }, 100 * i);
        })(i);
      }
      return d.promise;
    },
    createPlaylist: function(){
      d = $q.defer();
      $http.post(baseUrl + '/v1/users/' + Auth.getUsername() + '/playlists', { name: "OrbWeaver Playlist"}, {
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
    addTracksToPlaylist: function(playlistId, tracksArray) {
      this.createPlaylist().then(function(){
        $http.post(baseUrl + '/v1/users/' + Auth.getUsername() + '/playlists/' + playlistId + '/tracks?' + 'uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh', {}, {
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
//we need to search "https://api.spotify.com/v1/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin"
//we need to take those artists and hit the top tracks end point
//we need to take those top tracks and create a playlist in the user's account

