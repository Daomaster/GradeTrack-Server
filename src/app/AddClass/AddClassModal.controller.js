(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('AddClassModalController', AddClassModalController);
  /** @ngInject */
  function AddClassModalController(GradeService, $http, $scope, $uibModalInstance) {
    var vm = this;

    vm.close = function()
    {
      vm.studentString="";
      vm.courseName = "";  // reset
      vm.students = [];
      vm.showError=false;
      $uibModalInstance.dismiss('cancel');
    };

    vm.courseName = "";
    vm.students = [];
    vm.studentString = "";
    vm.description = "";

    vm.showError = false;


    vm.createCourse = function()
    {
      var i;
      if (vm.courseName == "") {
        vm.showError = true;  //class empty error
        return; // empty class error
      }


      var course = GradeService.addCourse(vm.courseName);
      for (i = 0; i < vm.students.length; ++i)
      {
        GradeService.addStudent(course, vm.students[i].name, 0);
      }




      //format for post
      var c =
      {
        title: vm.courseName,
        students: [],
        instructor: "",
        description: vm.description
      };

      for (i =0; i < vm.students.length; ++i)
      {
        c.students.push(vm.students[i].name);
      }
      c.instructor = GradeService.firstName + " " + GradeService.lastName;


      //send
      $http.post("http://localhost:3000/api/info/addstudents", {
        title: c.title,
        students: c.students,
        insName: c.instructor
      });





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
