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
    vm.showError = false;
    vm.addAssignment = function()
    {
      if (vm.assignmentName == "")
      {
        vm.showError = true;
        return;
      }



      //$$placeholder             -- add assignment post
      //vm.course                 -- course to add assignment to
      //vm.assignmentName         -- name
      //vm.assignmentDescription  -- description
      //vm.points                 -- points the assignment is worth


      GradeService.addAssignment(vm.course, vm.assignmentDescription, vm.assignmentName, vm.points);
      vm.close();


    };


    vm.close = function()
    {
      vm.assignmentDescription = "";
      vm.assignmentName = "";
      vm.points=0;
      vm.showError = false;
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
