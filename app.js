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

  app.controller('AppController', function($scope, Auth, $location, bandsInTownService, spotifyService, userService) {

    function checkUser(redirectToLogin) {
      spotifyService.getMe().then(function(userInfo) {
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

    //$scope.$on('login', function() {
    //});

    $scope.weave = weave;

    function weave() {
      console.log('weaving');
      bandsInTownService.getBands(userService.getUserLocation()).then(function(bandsResponse) {
        spotifyService.getArtistIds(bandsResponse).then(function(artistIds){
          spotifyService.getTopTracks(artistIds).then(function(topTracks){
            spotifyService.addTracksToPlaylist(topTracks);
          });
        });
      });
    }

    bandsInTownService.getBands("denver,co").then(function(response){
      console.log(response);
    });

    //$scope.$on('logout', function() {
    //  $scope.showLogin = false;
    //});

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
//Shovel failed 429 calls into their own collection and re-run function after timeout

//two options or two apps: one that works for any city and uses random selection of artists, or one for denver for specific venues with all artists

//deal with page numbers in bandsintown call - limit to venues, filter results by venue
//add current location option that uses bandsintown location