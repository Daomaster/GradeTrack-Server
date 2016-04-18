(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GradeService) {
    var vm = this;

    vm.tabs = [
      {
        active: true,
        label: "Information",
        url: "#/"

      },
      {
        active: false,
        label: "Assignments",
        url: "#/assignments"
      },
      {
        active: false,
        label: "Students",
        url: "#/students"
      }
    ];

    vm.activeTab = vm.tabs[0];
    vm.lastName = GradeService.firstName;
    vm.firstName = GradeService.lastName;
    vm.courses = function() { return GradeService.courses; };
    vm.getActiveCourse = function(){return GradeService.getActiveCourse(); };
    vm.setActiveCourse = function(id) {GradeService.setActiveCourse(id); };

    vm.clickTab = function(course,tab)
    {
      vm.setActiveCourse(course.id);
      vm.activeTab.active=false;
      vm.activeTab = tab;
      vm.activeTab.active=true;
    };

    vm.isActiveTab = function(course,tab) {
      return (course == vm.getActiveCourse() && tab.active);
    };


  }
})();
