
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('GradeService', function(){


      this.loggedIn = false;
      this.lastName = "Prof";
      this.firstName = "name";
      this.email = "";
      this.username = "";
      this.userID = "";

      this.gradeAverageArray = []; // needed for dashboard graphing
      this.courseNameArray = [];

      this.courses=[];

      this.postLogin = function()
      {
        this.currentCourseID = 0;
        this.currentAssignmentID = 0;
        if (this.courses.length > 0)
          this.activeCourse = this.courses[0];
      };

      this.addCourse = function(name_)             // add data as it becomes needed
      {
        var c =
        {
          name : name_,
          description: "",
          serverID: "",       //for db
          expanded : false,   // internal use
          average: Math.round((Math.random() * 50 + 50) * 100) / 100, //random 50-100, 2 decimals
          id : this.courses.length, //internal use
          assignments: [],
          students: [],
          weights: [
            {
              name: "Test",
              weight: 40
            },
            {
              name: "Quiz",
              weight: 30
            },
            {
              name: "Homework",
              weight: 30
            }
          ]
        };

        this.courses.push(c);
        this.gradeAverageArray.push(c.average);
        this.courseNameArray.push(c.name);
        return c;
      };

      this.currentCourseID = 0;
      this.getActiveCourse = function() { return this.courses[this.currentCourseID]};
      this.setActiveCourse = function(id) {
      this.currentCourseID = id;
      this.currentAssignmentID = 0; // reset for safety
      };
      this.currentAssignmentID = 0;
      this.getActiveAssignment = function() { return this.getActiveCourse().assignments[this.currentAssignmentID]; };
      this.setActiveAssignment = function(id) { this.currentAssignmentID = id; };

      this.purgeData = function() // for use on logout
      {
        this.lastName = "";
        this.firstName = "";
        this.courses = [];
        this.gradeAverageArray = [];
        this.courseNameArray = [];
      };

      this.serverIDtoAssignmentID = function(course, key)
      {
        console.log(course);
        for (var i = 0; i < course.assignments.length; ++i)
        {
          console.log(course.assignments[i].serverID + "==" + key);
          if (course.assignments[i].serverID == key)
            return i;
        }
        console.log("err");
        return -1;
      };

      this.addStudent = function(course, name_, id_) {
        var t = {
          name: name_,
          firstName: "",
          lastName: "",
          email: "",
          studentID: id_,
          id: course.students.length,
          assignmentGrades: [],
          oldAssignmentGrades: [],  //graph purposes
          overallGrade: 0
        };
        for (var i = 0; i < course.assignments.length; ++i) {
          t.assignmentGrades.push(0);
          t.oldAssignmentGrades.push(0);
        }
        course.students.push(t);
        return t;
      };

      this.randomDate = function()
      {
        var year = 2016;
        var month = 1 + Math.random() * 4; //jan-may
        var day = 1 + Math.random() * 30;
         return new Date(year,month,day);
      };

      this.addAssignment = function(course, description_, assignmentName, _points)
      {
        var t = {
          name: assignmentName,
          description: description_,
          datepickerOpen: false,    // assignment menu usage
          id: course.assignments.length,
          points: _points,
          serverID: "",
          type: "Test",
          dueDate: this.randomDate(),
          gradeArray: [0,0,0,0,0] //for graph display
        };
        t.gradeArray[4]= course.students.length;  //initialize to all F (for graph)
        for (var i = 0; i < course.students.length;++i)
        {
          course.students[i].assignmentGrades.push(0);
          course.students[i].oldAssignmentGrades.push(0);
        }
        course.assignments.push(t);
        return t;
      };




      this.activeCourse = this.courses[0];

    });

})();
