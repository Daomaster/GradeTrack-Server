(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddStudentModalController', AddStudentModalController);
  /** @ngInject */
  function AddStudentModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;

    vm.firstname = "";
    

    vm.addAssignment = function()
    {
      GradeService.addAssignment(vm.course, vm.assignmentDescription, vm.assignmentName, vm.points);
      vm.close();
    };


    vm.close = function()
    {
      vm.assignmentDescription = "";
      vm.assignmentName = "";
      vm.points=0;
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
