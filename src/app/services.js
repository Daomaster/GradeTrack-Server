
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
          id : this.courses.length
        };
        this.courses.push(c);
      };

      this.currentCourseID = 0;
      this.getActiveCourse = function() { return this.courses[this.currentCourseID]};
      this.setActiveCourse = function(id) { this.currentCourseID = id; };


      //random data
      for (var i = 0; i < 5; ++i)
      {
        this.addCourse("CS" + (460+i).toString());
      }




      this.activeCourse = this.courses[0];

    });

})();
