
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('StudentService', function(){

	this.students = [
		{
			last: "Smith",
			first: "James",
			grade: "80%", // Switch to float?
			email: "SmithJ@unlv.nevada.edu",
			id: "11223344"
		},

		{
			last: "Williams",
			first: "Rebecca",
			grade: "85%", // Switch to float?
			email: "WilliamsR@unlv.nevada.edu",
			id: "2244553322"
		},

		{
			last: "Aster",
			first: "Billy",
			grade: "66%", // Switch to float?
			email: "AsterB@unlv.nevada.edu",
			id: "43233333"
		},

		{
			last: "Bills",
			first: "Derek",
			grade: "90%", // Switch to float?
			email: "BillsD@unlv.nevada.edu",
			id: "1010101010"
		},

		{
			last: "Dillan",
			first: "Ben",
			grade: "45%", // Switch to float?
			email: "DillanB@unlv.nevada.edu",
			id: "3428237420"
		}
	];

	this.list = function() {
		return this.students;
	};

	});

})();
