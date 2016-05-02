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

    vm.errorPassword = false;
    vm.errorUsername = false;
    vm.errorLogin = false;

    vm.setErrorsOff = function()
    {
      vm.errorPassword = false;
      vm.errorUsername = false;
      vm.errorLogin = false;
    };


    vm.login = function()
    {
      vm.setErrorsOff();          // for multiple failed logins

      var error = false;
      if (vm.username == "") {    // blank username field
        vm.errorUsername = true;
        error=true;
      }
      if (vm.password == "") {    // blank password field
        vm.errorPassword = true;
        error=true;
      }
      if (error) return;          // don't attempt login


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
          vm.errorLogin = true;     // show invalid login message

        }
      );


      vm.close();

    };
    vm.close = function()
    {
      vm.errorPassword = vm.errorUsername = vm.errorLogin = false;
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
