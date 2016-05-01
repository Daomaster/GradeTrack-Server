(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('signupModalController', signupModalController);

  /** @ngInject */
  function signupModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;
    vm.type = "student";
    vm.email = "";
    vm.username = "";
    vm.password = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.studentID = 0;
    vm.signup = function()
    {
      var userInfo = {
        username: vm.username,
        email: vm.email,
        firstName: vm.firstName,
        lastName: vm.lastName,
        password: vm.password,
        type: vm.type
      };

      $http.post("http://localhost:3000/api/auth/signup", userInfo);

      $uibModalInstance.dismiss('cancel');
    };
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
