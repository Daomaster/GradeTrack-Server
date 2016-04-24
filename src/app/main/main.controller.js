(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GradeService, $uibModal) {
    var vm = this;

    vm.isLoggedIn = function() { return GradeService.loggedIn;  };
    vm.login = function() {
      GradeService.loggedIn = true;};

    vm.logout = function()
    {
      GradeService.loggedIn = false;
    };

    vm.tabs = [
      {
        active: true,
        label: "Information",
        url: "#/information"

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

    vm.openLogin = function (size) {

      $uibModal.open({
        animation: true,
        templateUrl: 'app/login/LoginModal.html',
        controller: 'LoginModalController',
        controllerAs: 'LoginModalController',
        size: size
      });
    };
    vm.openAddClass = function (size) {

      $uibModal.open({
        animation: true,
        templateUrl: 'app/AddClass/AddClassModal.html',
        controller: 'AddClassModalController',
        controllerAs: 'AddClassModalController',
        size: size
      });
    };

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
