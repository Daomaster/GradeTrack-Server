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
    vm.officeHours = GradeService.officeHours;
    vm.tempDescription = GradeService.activeCourse().description;

    vm.toggleDisable1 = function() {
      InfoService.toggleDisable1();
    }

    vm.toggleDisable2 = function() {
      InfoService.toggleDisable2();
    }

    vm.toggleShow3 = function() {
      InfoService.toggleShow3();
    }

    vm.editInfoStatus = function () {
      return InfoService.editInfoStatus();
    }

    vm.editDesStatus = function () {
      return InfoService.editDesStatus();
    }

    vm.showTabStatus = function () {
      return InfoService.showTabStatus();
    }

    vm.submitNewDesc = function() {
      InfoService.toggleDisable1();
      GradeService.getActiveCourse().description = tempDescription;
    }

    vm.genPDF = function () {

    };
  }
})();
