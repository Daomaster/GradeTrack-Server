(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
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
        label: "Grades",
        url: "#/grades"
      },
      {
        active: false,
        label: "Students",
        url: "#/students"
      }
    ];

    vm.activeTab = vm.tabs[0];
    vm.lastName = "Name";
    vm.firstName = "Prof";
    vm.courses = [
      {
        id: 0,
        expanded:false,
        active:true,
        name : "CS470",
        assignments: [
          {
            name: "Assignment 1"
          },
          {
            name: "Assignment 2"
          },
          {
            name: "Assignment 3"
          },
          {
            name: "Assignment 4"
          },
          {
            name: "Assignment 5"
          }
        ]
      },
      {
        id: 1,
        expanded:false,
        active:false,
        name : "CS471",
        assignments: [
          {
            name: "Assignment 1b"
          },
          {
            name: "Assignment 2b"
          },
          {
            name: "Assignment 3b"
          },
          {
            name: "Assignment 4b"
          },
          {
            name: "Assignment 5b"
          }
        ]
      },
      {
        id: 2,
        expanded:false,
        active:false,
        name : "CS472",
        assignments: [
          {
            name: "Assignment 1c"
          },
          {
            name: "Assignment 2c"
          },
          {
            name: "Assignment 3c"
          },
          {
            name: "Assignment 4c"
          },
          {
            name: "Assignment 5c"
          }
        ]
      }
    ];
    vm.activeCourse = vm.courses[0];

    vm.clickTab = function(course,tab)
    {
      vm.changeActiveCourse(course);
      vm.activeTab.active=false;
      vm.activeTab = tab;
      vm.activeTab.active=true;
    };

    vm.isActiveTab = function(course,tab) {
      return (course == vm.activeCourse && tab.active);
    };

    vm.changeActiveCourse = function(course)
    {
      if (course == vm.activeCourse) //already done
        return;
      vm.activeCourse.active=false;
      vm.activeCourse = course;
      course.active=true;
    }

  }
})();
