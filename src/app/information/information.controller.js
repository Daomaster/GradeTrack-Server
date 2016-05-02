(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('InformationController', InformationController);

  /** @ngInject */
  function InformationController(InfoService, GradeService) {
    var vm = this;

    vm.activeCourse = function() { return GradeService.getActiveCourse() };

    vm.instName = function() { return GradeService.lastName + " " + GradeService.firstName };

    vm.email = function() { return GradeService.lastName + GradeService.firstName[0] + "@unlv.edu" }

    // TODO: Connections to service

  }
})();
