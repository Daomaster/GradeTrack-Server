(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('signupModalController', signupModalController);

  /** @ngInject */
  function signupModalController(GradeService, $scope, $uibModalInstance) {
    var vm = this;
    vm.type = "";
    vm.email = "";
    vm.username = "";
    vm.password = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.studentID = 0;
    vm.login = function()
    {
      //$$placeholder for login
      //  use vm.username, vm.password
      //  receive teacher json, put in gradeservice



      GradeService.postLogin(); //set default values

      GradeService.loggedIn = true;
      $uibModalInstance.dismiss('cancel');
    };
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
