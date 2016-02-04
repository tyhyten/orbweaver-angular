(function() {

  var module = angular.module('OrbWeaver');

  module.controller('SignInController', function($scope, Auth){
    $scope.login = function(){
      Auth.openLogin();
    }
  });

})();
