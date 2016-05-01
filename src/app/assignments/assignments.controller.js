(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AssignmentsController', AssignmentsController);

  /** @ngInject */
  function AssignmentsController(GradeService, $log, $uibModal) {
    var vm = this;
    vm.showDetails = false;
    vm.activeCourse = function() { return GradeService.getActiveCourse()};

    vm.activeAssignment = function() { return GradeService.getActiveAssignment(); };
    vm.setActiveAssignment = function(id) { GradeService.setActiveAssignment(id); };

    vm.clickAssignment = function(id)
    {
        GradeService.setActiveAssignment(id);
        vm.showDetails = true;
    };

    /*
    vm.submitAssignmentChange = function(assignment)
    {

    };
    vm.submitNewAssignment = function(assignment)
    {

    };
*/

  vm.openAddAssignment = function (size) {

    $uibModal.open({
      animation: true,
      templateUrl: 'app/AddAssignment/AddAssignmentModal.html',
      controller: 'AddAssignmentModalController',
      controllerAs: 'AddAssignmentModalController',
      size: size
    })
  };
    vm.SendModifiedDueDate = function(assignment)
    {
      //$$placeholder - due date for assignment has been changed
      $log.log("SendModifiedDueDate: " + assignment.name + " - " + assignment.dueDate);
    };

    vm.SendModifiedGrade = function(assignment, student)
    {
      //$$placeholder - grade for student on assignment has been changed
      $log.log("SendModifiedGrade: " + student.name + " on " + assignment.name + " " + student.assignmentGrades[assignment.id]);
    };
    vm.SendModifiedPoints = function(assignment)
    {
      //$$placeholder - points for assignment have been modified
      $log.log("SendModifiedPoints: " + assignment.name + " - " + assignment.points);
    };
    vm.SendModifiedDescription = function(assignment)
    {
      //$$placeholder - descriptions of assignment has been modified
      $log.log("SendModifiedDescription: " + assignment.name + " - " + assignment.description);
    };
    vm.SendModifiedAssignmentName = function(assignment)
    {
      //$$placeholder - name of assignment has been modified
      $log.log("SendModifiedAssignmentName: " + assignment.name);
    };

    vm.getGradeIndex = function(percent)
    {
      if (percent >= 0.9)
        return 0;
      else if (percent >= 0.8)
        return 1;
      else if (percent >= 0.7)
        return 2;
      else if (percent >= 0.6)
        return 3;
      return 4;
    };
    vm.changeGradeArray = function(assignment, student)
    {
      var id = assignment.id;
      var newGrade = student.assignmentGrades[id];
      var oldGrade = student.oldAssignmentGrades[id];
      var oldIndex = 4;
      if (oldGrade != null)
        oldIndex = vm.getGradeIndex(oldGrade / assignment.points);
      var newIndex = 4;
      if (newGrade != null)
        newIndex = vm.getGradeIndex(newGrade / assignment.points);
        --assignment.gradeArray[oldIndex];
        ++assignment.gradeArray[newIndex];

    };

    vm.labelArray = [ "A","B","C","D","F" ];

  }
})();
