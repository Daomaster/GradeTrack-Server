(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('InformationController', InformationController);

  /** @ngInject */
  function InformationController(InfoService, GradeService) {
    var vm = this;

    vm.activeCourse = function() { return GradeService.getActiveCourse() };

    vm.instName = GradeService.lastName + " " + GradeService.firstName;
    vm.email = GradeService.email;
    vm.phone = GradeService.phone;

    vm.genPDF = function () {
      
    };
  }
})();
