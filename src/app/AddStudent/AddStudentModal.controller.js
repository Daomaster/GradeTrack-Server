(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddStudentModalController', AddStudentModalController);
  /** @ngInject */
  function AddStudentModalController(GradeService, $http, $scope, $uibModalInstance, StudentService) {
    var vm = this;

    vm.course = GradeService.getActiveCourse();

    vm.email = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.studentID = "";


    vm.addStudent = function()
    {
      var newStudent =
      {

        last: vm.lastName,
        first: vm.firstName,
        grade: "", // Switch to float?
        email: vm.email,
        id: vm.studentID
      };

      StudentService.students.push(newStudent);

      vm.close();
    };


    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
