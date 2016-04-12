(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AssignmentsController', AssignmentsController);

  /** @ngInject */
  function AssignmentsController(GradeService) {
    var vm =this;

    vm.test = false;
    vm.activeCourse = function() { return GradeService.getActiveCourse().name };

    vm.courses = GradeService.courses;

  }
})();
