(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .config(routeConfig);

  function routeConfig($routeProvider) {      //navbar, information, grades, assignments, students
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/information', {
        templateUrl: 'app/information/information.html',
        controller: 'InformationController',
        controllerAs: 'information'
      })
      .when('/assignments', {
        templateUrl: 'app/assignments/assignments.html',
        controller: 'AssignmentsController',
        controllerAs: 'assignments'
      })
      .when('/students', {
        templateUrl: 'app/students/students.html',
        controller: 'StudentsController',
        controllerAs: 'students'
      })
      .when('/grades', {
        templateUrl: 'app/grades/grades.html',
        controller: 'GradesController',
        controllerAs: 'grades'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
