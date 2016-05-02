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


    vm.errorText = {
      email: "",
      id: "",
      first: "",
      last: ""
    };


    vm.isInputError = function()
    {

      //reset
      vm.errorText.first = vm.errorText.last = vm.errorText.email = vm.errorText.id = "";


      //catch-all
      var error = false;
      //email err
      if (vm.email == "")
      {
        vm.errorText.email = "Enter an email";
        error=true;
      }
      else
      {
        //other email restrictions
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(vm.email))) // email format check
        {
          vm.errorText.email = "Invalid email";
          error=true;
        }
      }

      //name err
      if (vm.firstName == "")
      {
        vm.errorText.first = "Enter a first name";
        error=true;
      }
      if (vm.lastName == "")
      {
        vm.errorText.last = "Enter a last name";
        error = true;
      }



      // id err
      if (vm.studentID == "")
      {
        vm.errorText.id = "Enter an ID";
        error=true;
      }
      else
      {
        if (isNaN(vm.studentID))  // numbers only
        {
          vm.errorText.id = "Invalid ID";
          error=true;
        }
      }

      return error;

    };





    vm.addStudent = function()
    {

      if (vm.isInputError()) return; // invalid input


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
