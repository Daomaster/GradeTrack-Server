(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('StudentsController', StudentsController);

  /** @ngInject */
  function StudentsController(StudentService, GradeService, $uibModal) {
    var vm = this;

    vm.list = function() { return  GradeService.getActiveCourse().students; };
    vm.activeCourse = function() { return GradeService.getActiveCourse() };

    vm.overallGrade = function(student) { return GradeService.getOverallGrade(student, vm.activeCourse());};


    vm.removeStudent = function(student)
    {

      var index = StudentService.students.indexOf(student);
      if (index > -1)
      {
        StudentService.students.splice(index,1);
      }
    };

    vm.openAddStudentModal = function (size) {

      $uibModal.open({
        animation: true,
        templateUrl: 'app/AddStudent/AddStudentModal.html',
        controller: 'AddStudentModalController',
        controllerAs: 'AddStudentModalController',
        size: size
      })
    };
  }
})();
