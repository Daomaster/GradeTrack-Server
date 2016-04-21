
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('GradeService', function(){

      this.loggedIn = false;
      this.lastName = "Prof";
      this.firstName = "name";


      this.courses=[];

      this.addCourse = function(name_)             // add data as it becomes needed
      {
        var c =
        {
          name : name_,
          expanded : false,
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
