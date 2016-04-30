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


    vm.login = function()
    {
      var loginInfo = {
        username: vm.username,
        password: vm.password
      }

    $http.post("http://localhost:3000/api/auth/signin", loginInfo).then(
      function successCallback() {

          GradeService.postLogin(); //set default values
          GradeService.loggedIn = true;
          $uibModalInstance.dismiss('cancel');

        },

        function errorCallback() {
          //on Error
        }
      );

    };
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
