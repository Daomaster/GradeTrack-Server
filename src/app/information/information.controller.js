(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('InformationController', InformationController);

  /** @ngInject */
  function InformationController(InfoService, GradeService, StudentService) {
    var vm = this;

    vm.activeCourse = function() { return GradeService.getActiveCourse() };

    vm.instName = GradeService.lastName + " " + GradeService.firstName;
    vm.email = GradeService.email;
    vm.phone = GradeService.phone;

    vm.fillSyllabus = function () {
      // Use GradeService
      // description is at GradeService.getActiveCourse().description
      
    }
  }
})();
