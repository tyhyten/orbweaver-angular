var module = angular.module('OrbWeaver');

module.directive('logIn', function(Auth) {
  return {
    restrict: 'E',
    //scope: {
    //
    //},
    templateUrl: '/partials/login.html',
    link: function (scope, el, attrs) {
      scope.login = function() {
        Auth.openLogin();
      };
      scope.username = Auth.getDisplayName();
      scope.logout = function() {
        Auth.closeLogin();
        scope.$emit('logout')
      };
    }
  };

  //  controllerAs: 'ctrl',
  //  controller: function (Auth) {
  //    var ctrl = this;
  //    ctrl.login = function() {
  //      Auth.openLogin();
  //    };
  //    ctrl.username = Auth.getDisplayName();
  //    ctrl.logout = function() {
  //      Auth.closeLogin();
  //    };
  //    return ctrl;
  //  }
  //}
});