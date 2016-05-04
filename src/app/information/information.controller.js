(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .controller('InformationController', InformationController);

  /** @ngInject */
  function InformationController(InfoService, GradeService) {
    var vm = this;

    vm.activeCourse = function() { return GradeService.getActiveCourse() };

    vm.instName = GradeService.lastName + " " + GradeService.firstName;
    vm.email = GradeService.email;
    vm.phone = GradeService.phone;
    vm.officeHours = GradeService.officeHours;

    vm.toggleDisable1 = function() {
      if (InfoService.editDesStatus()) {
        // They're getting rid of their changes
        // So reset tempDescription
        var courses = GradeService.courses;
        for (var i = 0; i < courses.length; i++) {
          courses[i].tempDescription = courses[i].description;
        }

        //GradeService.getActiveCourse().tempDescription = GradeService.getActiveCourse().description;
      }


      InfoService.toggleDisable1();
    }

    vm.toggleDisable2 = function() {
      InfoService.toggleDisable2();
    }

    vm.toggleShow3 = function() {
      InfoService.toggleShow3();
    }

    vm.editInfoStatus = function () {
      return InfoService.editInfoStatus();
    }

    vm.editDesStatus = function () {
      return InfoService.editDesStatus();
    }

    vm.showTabStatus = function () {
      return InfoService.showTabStatus();
    }

    vm.submitNewDesc = function() {
      InfoService.toggleDisable1();
      GradeService.getActiveCourse().description = GradeService.getActiveCourse().tempDescription;
    }

    vm.fillSyllabus = function () {


      var doc = new jsPDF('p', 'pt', 'letter');

      var text0 = document.getElementById("p1").innerText;


      var text1 = document.getElementsByTagName("p")[1].textContent;
      var text2 = document.getElementsByTagName("p")[2].textContent;
      var text3 = document.getElementsByTagName("p")[3].textContent;
      var text4 = document.getElementsByTagName("p")[4].textContent;
      var text5 = document.getElementsByTagName("p")[5].textContent;
      var text6 = document.getElementsByTagName("p")[6].textContent;
      doc.setFontSize(13);
      doc.textAlign(text0, {
                align: "center"
              },0,56);
      doc.textAlign(text1, {
                align: "center"
              },0,78);
      doc.textAlign(text2, {
                align: "center"
              },0,100);
      doc.textAlign(text3, {
                align: "center"
              },0,122);
      doc.textAlign(text4, {
                align: "center"
              },0,144);
      doc.textAlign(text5, {
                align: "center"
              },0,166);
      doc.textAlign(text6, {
                align: "center"
              },0,188);


      doc.fromHTML(document.getElementById('syllabusBody'), 42,210,{
               'width':538,
      });

/*
      doc.fromHTML(document.getElementById('#scheduleHeader'), 42,540,{
               'width':538,
     });

      doc.fromHTML(document.getElementById('unlvPolicies'), 42,270,{
               'width':538,
      });
*/
      doc.save('Syllabus.pdf');
    };
    // Try to add API call for centering
    (function(API) {
		API.textAlign = function(txt, options, x, y) {
				options = options || {};
				// Use the options align property to specify desired text alignment
				// Param x will be ignored if desired text alignment is 'center'.
				// Usage of options can easily extend the function to apply different text
				// styles and sizes

				// Get current font size
				var fontSize = this.internal.getFontSize();

				// Get page width
				var pageWidth = this.internal.pageSize.width;

				// Get the actual text's width
				// You multiply the unit width of your string by your font size and divide
				// by the internal scale factor. The division is necessary
				// for the case where you use units other than 'pt' in the constructor
				// of jsPDF.

				var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

				if (options.align === "center") {

						// Calculate text's x coordinate
						x = (pageWidth - txtWidth) / 2;

				} else if (options.align === "centerAtX") { // center on X value

						x = x - (txtWidth / 2);

				} else if (options.align === "right") {

						x = x - txtWidth;
				}

				// Draw text at x,y
				this.text(txt, x, y);
		};
		/*
		    API.textWidth = function(txt) {
			    var fontSize = this.internal.getFontSize();
		        return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
		    };
		*/

		API.getLineHeight = function(txt) {
				return this.internal.getLineHeight();
		};

})(jsPDF.API);
  }
})();
