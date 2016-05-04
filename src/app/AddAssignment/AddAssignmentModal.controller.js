(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddAssignmentModalController', AddAssignmentModalController);
  /** @ngInject */
  function AddAssignmentModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;

    vm.course = GradeService.getActiveCourse();
    vm.assignmentDescription = "";
    vm.assignmentName = "";
    vm.points = 0;
    vm.dueDate = new Date();
    vm.datepickerOpen = false;
    vm.errorText = "";

    vm.createSuccess = function(key)
    {
      var assign = GradeService.addAssignment(vm.course, vm.assignmentDescription, vm.assignmentName, vm.points);
      assign.serverID = key;
    };



    vm.addAssignment = function()
    {
      vm.errorText = "";
      if (vm.assignmentName == "")
      {
        vm.errorText = "Enter an assignment name";
        return;
      }



      var due = {
        year: vm.dueDate.getYear(),
        month: vm.dueDate.getMonth(),
        day: vm.dueDate.getDate(),
        hour: 0,
        minute: 0,
        second: 0

      };

      $http.post("http://localhost:3000/api/info/addassign",
        {
          courseid : vm.course.serverID,
          title: vm.assignmentName,
          description: vm.assignmentDescription,
          total: vm.points,
          due: due
        }
      ).then(
        function successCallback(res) {
          vm.createSuccess(res.data);
          $uibModalInstance.dismiss('cancel');

          vm.close();
        },

        function errorCallback() {
          //on Error
          console.log("error");

        }
      );



      //$$placeholder             -- add assignment post
      //vm.course                 -- course to add assignment to
      //vm.assignmentName         -- name
      //vm.assignmentDescription  -- description
      //vm.points                 -- points the assignment is worth


      vm.close();


    };


    vm.close = function()
    {
      vm.assignmentDescription = "";
      vm.assignmentName = "";
      vm.points=0;
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
