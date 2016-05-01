(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddAssignmentModalController', AddAssignmentModalController);
  /** @ngInject */
  function AddAssignmentModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;

    vm.course = GradeService.getActiveCourse();
    vm.assignmentDescription = "";
    vm.assignmentName = "";
    vm.points = 0;
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
