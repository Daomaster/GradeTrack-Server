(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(GradeService) {
    var vm = this;


    vm.series = ['Series A'];

    vm.professorName = function() { return GradeService.firstName + " " + GradeService.lastName; };
    vm.studentsEnrolled = function()
    {
      var answer = 0;
      for (var i = 0; i < GradeService.courses.length; ++i)
      {
        answer += GradeService.courses[i].students.length;
      }
      return answer;
    };


    GradeService.loadTimelineData(); // for successive loads
    vm.items = function() { return GradeService.visArray; };


    // Configuration for the Timeline
    vm.options = {
      height:'150px',
      start:'2016-01-19',
      end: '2016-5-14'
    };


    vm.getCourses = function() { return GradeService.courses; };

    vm.getGradeArray = function(course)
    {
      var result = [
        {grade: "A", amount: 0 },
        {grade: "B", amount: 0 },
        {grade: "C", amount: 0 },
        {grade: "D", amount: 0 },
        {grade: "F", amount: 0 }
      ]; //a,b,c,d,e,f
      for (var i = 0; i < course.students.length; ++i)
      {
        var index = 0;
        if (course.students[i].average >= 90)
          index=0;
        else if (course.students[i].average >= 80)
          index = 1;
        else if (course.students[i].average >= 70)
          index=2;
        else if (course.students[i].average >= 60)
          index=3;
        else
          index=4;
        ++result[index].amount;
      }
      return result;
    };


    vm.gradeAverageArray = [GradeService.gradeAverageArray ];
    vm.courseNameArray = GradeService.courseNameArray;
  }
})();
