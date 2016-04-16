
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('GradeService', function(){

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
          students: []
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
          overallGrade: 0
        };
        for (var i = 0; i < course.assignments.length; ++i)
          t.assignmentGrades.push(0);
        course.students.push(t);
      };

      this.addAssignment = function(course, description_, assignmentName)
      {
        var t = {
          name: assignmentName,
          description: description_,
          datepickerOpen: false,    // assignment menu usage
          id: course.assignments.length,
          points: 500
        };
        course.assignments.push(t);
      };


      //random data
      for (var i = 0; i < 5; ++i)
      {
        var c = this.addCourse("CS" + (460+i).toString());
        for (var j = 0; j < 5; ++j)
        {
          this.addAssignment(c, "text","Assignment " + j.toString());
        }

        for (var k = 0; k < 30; ++k)
        {
          this.addStudent(c, "Student " + k.toString(), 1000000+ j);
        }
      }



      this.activeCourse = this.courses[0];

    });

})();
