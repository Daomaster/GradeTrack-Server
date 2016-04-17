(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AssignmentsController', AssignmentsController);

  /** @ngInject */
  function AssignmentsController(GradeService) {
    var vm = this;

    vm.showDetails = false;
    vm.activeCourse = function() { return GradeService.getActiveCourse()};
    vm.addAssignment = function(assignmentName) { GradeService.addAssignment(vm.activeCourse(), "Enter Description", assignmentName)};


    vm.activeAssignment = function() { return GradeService.getActiveAssignment(); };
    vm.setActiveAssignment = function(id) { GradeService.setActiveAssignment(id); };

    vm.clickAssignment = function(id)
    {
        GradeService.setActiveAssignment(id);
        vm.showDetails = true;
    };

    vm.courses = GradeService.courses;

  }
})();
