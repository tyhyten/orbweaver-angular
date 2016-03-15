(function() {
  var app = angular.module('OrbWeaver', [
    'ngRoute',
    'google.places'
  ]);

  app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  });

  app.controller('AppController', function($scope, Auth, API, $location, bandsInTownService, spotifyService, userService) {

    function checkUser(redirectToLogin) {
      console.log('called')
      API.getMe().then(function(userInfo) {
        Auth.setDisplayName(userInfo.display_name);
        Auth.setUsername(userInfo.id);
        Auth.setUserCountry(userInfo.country);
        userService.setUserImage(userInfo.images[0].url);
        $scope.$emit('initialized');
        if (redirectToLogin) {
          $scope.$emit('login');
        }
      }, function(err) {
        console.log(err);
        //$location.replace();
      });
    }

    $scope.login = function() {
      Auth.openLogin();
    };
    $scope.username = Auth.getDisplayName();
    $scope.logout = function() {
      Auth.closeLogin();
      $scope.$emit('logout')
    };

    $scope.isLoggedIn = (Auth.getAccessToken() != '');

    $scope.$on('initialized', function(){
      $scope.userPhoto = userService.getUserImage();
      $scope.displayName = Auth.getDisplayName();
    });

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
    //});

    $scope.weave = weave;

    function weave() {
      console.log('weaving');
      bandsInTownService.getBands(userService.getUserLocation()).then(function(bandsResponse) {
        spotifyService.getArtistIds(bandsResponse).then(function(artistIds){
          spotifyService.getTopTracks(artistIds).then(function(topTracks){
            console.log(topTracks);
            spotifyService.addTracksToPlaylist(topTracks);
          });
        });
      });
    }

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
  });

})();


//we need to get artists ID's for all of the bandsInTownArtists v
//we need to search "https://api.spotify.com/v1/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin" v
//we need to take those artists and hit the top tracks end point v
//we need to take those top tracks and create a playlist in the user's account v
//We need to get artists that will be in town next week v
//Perhaps we change it to be shows happening now up to two weeks from now v
//Update search by address v
// Filter by venue?
// Make loging in and staying logged in work
//display success message for playlist creation
//Pass user location into bandsintown call
//Plug user data and city into a backend via API call
//Disable submit button while playlist is being created to prevent restarting the process
//Chunk top tracks call into groups of 15 with a timeout between to avoid rate limit. Try doing in app.js rather than method itself because of complexity of using two IIFE's inside of two forEach's
//Add SASS
//Add background image
