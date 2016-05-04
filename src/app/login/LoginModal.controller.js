(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('LoginModalController', LoginModalController);

  /** @ngInject */
  function LoginModalController(GradeService, $http, $log, $scope, $uibModalInstance) {
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



    $http.post("https://grade-server.herokuapp.com/api/auth/signin", loginInfo).then(
      function successCallback() {

        vm.postLogin(loginInfo.username);
          $uibModalInstance.dismiss('cancel');

        },

        function errorCallback() {
          //on Error
          vm.errorText.login = "Invalid login"

        }
      );


      vm.close();

    };

    vm.dataSet = false;

    vm.postLogin = function(usr)
    {
      var user = {
        username: usr
      };
      $http.post("https://grade-server.herokuapp.com/api/info/user", user).then(
        function successCallback(res) {

          if (!vm.dataSet) // debounce
          {


            GradeService.firstName = res.data.firstName;
            GradeService.lastName = res.data.lastName;
            GradeService.email = res.data.email;
            GradeService.userID = res.data.id;
            GradeService.username = res.data.username;


            for (var i = 0; i < res.data.courses.length; ++i)
            {
              var course = res.data.courses[i];

              var c = GradeService.addCourse(course.title);
              c.description = course.description;
              c.tempDescription = c.description;
              c.average = 0;
              if (course.total != 0)
                c.average = course.earned / course.total;
              c.serverID = course.courseid;


              // add assignments
              for (var key in course.assignments)
              {
                var assign = course.assignments[key];
                var a = GradeService.addAssignment(c, assign.description, assign.title, assign.total);
                a.serverID = key;
                a.dueDate = new Date(assign.due.year + "-" + assign.due.month + "-" + assign.due.day);
                a.gradeArray[4] = course.students.length;  //start f
              }

              //add students
              for (var id in course.students)
              {
                var student = course.students[id];
                var s = GradeService.addStudent(c, student.firstName + " " + student.lastName, id);
                s.firstName = student.firstName;
                s.lastName = student.lastName;
                s.email=student.email;
                s.average = student.earned / student.total;

                for (var k in student.grades)
                {
                  var ind = GradeService.serverIDtoAssignmentID(c, k);
                  s.assignmentGrades[ind]=s.oldAssignmentGrades[ind] = parseInt(student.grades[k],10);

                  var thisPercent = 0;
                  if (c.assignments[ind].points != 0)
                    thisPercent = parseInt(student.grades[k],10) / c.assignments[ind].points;
                  var gradeIndex = vm.getGradeIndex(thisPercent);
                  c.assignments[ind].gradeArray[4]--;
                  c.assignments[ind].gradeArray[gradeIndex]++;
                }


              }
              for (var l = 0; l < c.assignments.length;++l)
              {
                c.assignments[l].gradeArray[4] = c.students.length;
              }



            }



            GradeService.postLogin(); //set default values
            GradeService.loggedIn = true;
            vm.dataSet = true;
          }
        },
        function errorCallback() {
          //on Error
          vm.errorText.login = "Invalid login";

        });


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
    vm.close = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

  }
})();
