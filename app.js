(function() {
  var app = angular.module('OrbWeaver', ['ngRoute']);

  app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html',
        //controller: 'HomeController'
      });
  });
})();
//app.controller('AppController', function($scope, Auth, $location) {
//
//});
