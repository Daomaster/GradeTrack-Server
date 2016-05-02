(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('LoginModalController', LoginModalController);

  /** @ngInject */
  function LoginModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;
    vm.username = "";
    vm.password = "";


    vm.errorText =
    {
      password: "",
      username: "",
      login: ""
    };


    vm.checkInputErrors = function()
    {
      vm.errorText.password = vm.errorText.username = vm.errorText.login = "";

      var error = false;
      if (vm.username == "") {    // blank username field
        vm.errorText.username = "Enter a username";
        error=true;
      }
      if (vm.password == "") {    // blank password field
        vm.errorText.password = "Enter a password";
        error=true;
      }
      return error;          // don't attempt login
    };


    vm.login = function()
    {
      if (vm.checkInputErrors()) return; // input error


      var loginInfo = {
        username: vm.username,
        password: vm.password
      };



    $http.post("http://localhost:3000/api/auth/signin", loginInfo).then(
      function successCallback() {

          GradeService.postLogin(); //set default values
          GradeService.loggedIn = true;
          $uibModalInstance.dismiss('cancel');

        },

        function errorCallback() {
          //on Error
          vm.errorText.login = "Invalid login"

        }
      );


      vm.close();

    };
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
