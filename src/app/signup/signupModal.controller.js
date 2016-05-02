(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('signupModalController', signupModalController);

  /** @ngInject */
  function signupModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;
    vm.type = "student";
    vm.email = "";
    vm.username = "";
    vm.password = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.studentID = "";


    vm.errorText =
    {
      first: "",
      last: "",
      email: "",
      username:"",
      password:"",
      id:""
    };




    vm.isInputError = function()
    {

      //reset
      vm.errorText.first = vm.errorText.last = vm.errorText.email = vm.errorText.username =
        vm.errorText.password = vm.errorText.id = "";


      //catch-all
      var error = false;

      //username err
      if (vm.username == "")
      {
        vm.errorText.username = "Enter a username";
        error=true;
      }
      else
      {
        //other username restrictions
      }

      //password err
      if (vm.password=="")
      {
        vm.errorText.password = "Enter a password";
        error=true;
      }
      else
      {
        //other password restrictions
      }


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




    vm.signup = function()
    {


      if (vm.isInputError()) return; // invalid data


      var userInfo = {
        username: vm.username,
        email: vm.email,
        firstName: vm.firstName,
        lastName: vm.lastName,
        password: vm.password,
        type: vm.type
      };


      $http.post("http://localhost:3000/api/auth/signup", userInfo);

      $uibModalInstance.dismiss('cancel');
    };
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
