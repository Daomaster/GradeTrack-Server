(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboardCtrl'
      })
      .when('/information', {
        templateUrl: 'app/information/information.html',
        controller: 'InformationController',
        controllerAs: 'information'
      })
      .when('/assignments', {
        templateUrl: 'app/information/syllabus.html',
        controller: 'AssignmentsController',
        controllerAs: 'assignments'
      })
      .when('/students', {
        templateUrl: 'app/students/students.html',
        controller: 'StudentsController',
        controllerAs: 'students'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
