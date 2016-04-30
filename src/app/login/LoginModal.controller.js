(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('LoginModalController', LoginModalController);

  /** @ngInject */
  function LoginModalController(GradeService, $scope, $uibModalInstance) {
    var vm = this;
    vm.username = "";
    vm.password = "";
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
