(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(GradeService) {
    var vm = this;


    vm.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    vm.series = ['Series A'];

    vm.data = [
      [65, 59, 80, 81, 56, 55, 40]
    ];

    vm.getCourses = function() { return GradeService.courses; };

    vm.gradeAverageArray = [GradeService.gradeAverageArray ];
    vm.courseNameArray = GradeService.courseNameArray;
  }
})();
