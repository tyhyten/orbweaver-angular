(function() {
  var app = angular.module('OrbWeaver', ['ngRoute']);

  app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  });

  app.controller('AppController', function($scope, Auth, API, $location, bandsInTownService, spotifyService) {

    console.log('in AppController');

    function checkUser(redirectToLogin) {
      API.getMe().then(function(userInfo) {
        Auth.setDisplayName(userInfo.display_name);
        Auth.setUsername(userInfo.id);
        Auth.setUserCountry(userInfo.country);
        if (redirectToLogin) {
          $scope.$emit('login');
        }
      }, function(err) {
        console.log(err);
        //$location.replace();
      });
    }

    window.addEventListener("message", function(event) {
      console.log('got postmessage', event);
      var hash = JSON.parse(event.data);
      if (hash.type == 'access_token') {
        Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
        checkUser(true);
      }
    }, false);

    $scope.$watch(function() { return localStorage.getItem('pa_token'); }, function() {
      $scope.isLoggedIn = (Auth.getAccessToken() != '');
    });
    //$scope.showLogout = $scope.isLoggedIn;
    //$scope.showlogin = !$scope.isLoggedIn;

    //$scope.$on('login', function() {
    //  $scope.showplayer = true;
    //  $scope.showlogin = false;
      //$location.path('/').replace().reload();
    //});

    //$scope.$on('login', function() {
    //  $scope.showLogout = true;
    //});
    function spotifyBands() {

      bandsInTownService.getBands().then(function(bandsResponse) {
        spotifyService.getArtistIds(bandsResponse).then(function(artistIds){
          spotifyService.getTopTracks(artistIds).then(function(topTracks){
            //topTracks.forEach(function(track){
              //debugger;
            //});
          });
            //spotifyService.createPlaylist().then(function(playlistName){
            //  spotifyService.addTracksToPlaylist(playlistName,)
            //});
        });
      });
    }
   spotifyService.createPlaylist().then(function(response){
     spotifyService.addTracksToPlaylist(response);
   });

   //spotifyService.getTopTracks().then(function(r){
   //  console.log(r);
   //});
    //$scope.$on('logout', function() {
    //  $scope.showLogin = false;
    //});

    //$scope.getClass = function(path) {
    //  if ($location.path().substr(0, path.length) == path) {
    //    return 'active';
    //  } else {
    //    return '';
    //  }
    //};



    //$scope.focusInput = false;
    //$scope.menuOptions = function(playlist) {
    //
    //  var visibilityEntry = [playlist.public ? 'Make secret' : 'Make public', function ($itemScope) {
    //    API.changePlaylistDetails(playlist.username, playlist.id, {public: !playlist.public})
    //      .then(function() {
    //        playlist.public = !playlist.public;
    //      });
    //  }];

    //  var own = playlist.username === Auth.getUsername();
    //  if (own) {
    //    return [
    //      visibilityEntry,
    //      null,
    //      ['Rename', function ($itemScope) {
    //        playlist.editing = true;
    //        $scope.focusInput = true;
    //      }]
    //    ];
    //  } else {
    //    return [ visibilityEntry ];
    //  }
    //};

    //$scope.playlistNameKeyUp = function(event, playlist) {
    //  if (event.which === 13) {
    //    // enter
    //    var newName = event.target.value;
    //    API.changePlaylistDetails(playlist.username, playlist.id, {name: newName})
    //      .then(function() {
    //        playlist.name = newName;
    //        playlist.editing = false;
    //        $scope.focusInput = false;
    //      });
    //  }
    //
    //  if (event.which === 27) {
    //    // escape
    //    playlist.editing = false;
    //    $scope.focusInput = false;
    //  }
    //};
    //
    //$scope.playlistNameBlur = function(playlist) {
    //  playlist.editing = false;
    //  $scope.focusInput = false;
    //};

    checkUser();
    spotifyBands();
  });

})();
