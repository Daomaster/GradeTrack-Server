(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddClassModalController', AddClassModalController);
  /** @ngInject */
  function AddClassModalController(GradeService, $scope, $uibModalInstance) {
    var vm = this;

    vm.close = function()
    {
      vm.studentString="";
      vm.courseName = "";  // reset
      vm.students = [];
      $uibModalInstance.dismiss('cancel');
    };

    vm.courseName = "";
    vm.students = [];
    vm.studentString = "";



    vm.addCourseServerPackage = function()
    {
      var c =
      {
        title: vm.courseName,
        students: [],
        instructor: ""
      };

      for (var i =0; i < vm.students.length; ++i)
      {
        c.students.push(vm.students[i].name);
      }
      c.instructor = GradeService.firstName + " " + GradeService.lastName;

      // do stuff


    };

    vm.createCourse = function()
    {
      if (vm.courseName == "") return; // empty class error
      var course = GradeService.addCourse(vm.courseName);
      for (var i = 0; i < vm.students.length; ++i)
      {
        GradeService.addStudent(course, vm.students[i].name, 0);
      }
      vm.addCourseServerPackage();
      vm.close();

      

    };
    vm.addStudent = function(name_)
    {
      var student =
      {
        name: name_,
        id: vm.students.length
      };
      vm.students.push(student);
    };
    vm.removeStudent = function(name)
    {
      var index = vm.students.indexOf(name);
      if (index > -1)
      {
        vm.students.splice(index,1);
      }
    };
    vm.addMultipleStudents = function()
    {
      if (vm.studentString == "") return; // null check
      var names = vm.studentString;
      var result = names.split(",");
      for (var i = 0; i < result.length; ++i)
        vm.addStudent(result[i]);
      vm.studentString="";
    };


  }
})();