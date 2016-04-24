(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('StudentsController', StudentsController);

  /** @ngInject */
  function StudentsController(StudentService, GradeService) {
    var vm = this;

    vm.list = function() { return StudentService.list(); };
    vm.activeCourse = function() { return GradeService.getActiveCourse() };
  }
})();
