(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.activeTab = 0;


    vm.lastName = "Name";
    vm.firstName = "Prof";
    vm.courses = [
      {
        id: 0,
        name : "CS470",
        classText: "active",
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
        name : "CS471",
        classText: "",
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
        name : "CS472",
        classText: "",
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

    vm.changeActiveCourse = function(course)
    {
      vm.activeCourse.classText = "";
      vm.activeCourse = course;
      vm.activeCourse.classText = "active";
    }

  }
})();
