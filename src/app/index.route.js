(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
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
