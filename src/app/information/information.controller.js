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

    vm.toggleDisable1 = function() {
      if (InfoService.editDesStatus()) {
        // They're getting rid of their changes
        // So reset tempDescription
        var courses = GradeService.courses;
        for (var i = 0; i < courses.length; i++) {
          courses[i].tempDescription = courses[i].description;
        }

        //GradeService.getActiveCourse().tempDescription = GradeService.getActiveCourse().description;
      }

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
      GradeService.getActiveCourse().description = GradeService.getActiveCourse().tempDescription;
    }

    vm.genPDF = function () {

    };
  }
})();
