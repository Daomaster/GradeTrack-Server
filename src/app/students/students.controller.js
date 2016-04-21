(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('StudentsController', StudentsController);

  /** @ngInject */
  function StudentsController(StudentService) {
	var vm = this;
	
	vm.list = function() {
		return StudentService.list();
	};
  }
})();
