(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('LoginModalController', LoginModalController);

  /** @ngInject */
  function LoginModalController(GradeService, $scope, $uibModalInstance) {
    var vm = this;
    vm.login = function()
    {
      GradeService.loggedIn = true;
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
