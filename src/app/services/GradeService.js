
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('GradeService', function(){

      this.loggedIn = true;
      this.lastName = "Prof";
      this.firstName = "name";

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
          expanded : false,
          average: Math.round((Math.random() * 50 + 50) * 100) / 100, //random 50-100, 2 decimals
          id : this.courses.length,
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


      this.addStudent = function(course, name_, id_) {
        var t = {
          name: name_,
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
      };
      this.addAssignment = function(course, description_, assignmentName)
      {
        var t = {
          name: assignmentName,
          description: description_,
          datepickerOpen: false,    // assignment menu usage
          id: course.assignments.length,
          points: 500,
          type: "Test",
          dueDate: new Date(),
          gradeArray: [0,0,0,0,0] //for graph display
        };
        t.gradeArray[4]= course.students.length;  //initialize to all F (for graph)
        for (var i = 0; i < course.students.length;++i)
        {
          course.students[i].assignmentGrades.push(0);
          course.students[i].oldAssignmentGrades.push(0);
        }
        course.assignments.push(t);
      };


      //random data
      for (var i = 0; i < 5; ++i)
      {
        var c = this.addCourse("CS" + (460+i).toString());
        for (var j = 0; j < 5; ++j)
        {
          this.addAssignment(c, "Enter Description","Assignment " + j.toString());
        }

        for (var k = 0; k < 30; ++k)
        {
          this.addStudent(c, "Student " + k.toString(), 1000000+ j);
        }
        for (var l = 0; l < 5; ++l)
        {
          c.assignments[l].gradeArray[4] = c.students.length; //initial all to F
        }
      }



      this.activeCourse = this.courses[0];

    });

})();
