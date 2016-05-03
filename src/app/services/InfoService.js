
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('InfoService', function() {


      // Main data.
      // Use 'this' to make public.
      // Var for private.
      /*var classInfo = {
        id: 'CS 456',
        name: 'Automata and Formal Languages',
        info: 'Regular expressions. Regular, context-free, and unrestricted grammars. Finite and pushdown autoamata. Turing machines and the halting problem; introduction to decidability.'
        // pre: 'CS 302 and MATH 351'
      };

      var profile = {
        firstName:' Lawrence ',
        lastName:' Larmore ',
        phone: '702-895-1096',
        email:' larmore@egr.unlv.edu',
        office: ' TBEB 378B ',
        hours: 'Mon & Wed:  2:00~2:30 '
      }*/

      var editInfo = false;
      var editDes = false;
      var showTab = false;

      this.toggleDisable1 = function() {
        editDes = !editDes;
      }

      this.toggleDisable2 = function() {
        editInfo =  !editInfo;
      }

      this.toggleShow3 = function() {
        showTab = !showTab;
      }

      // TODO: Getters/setters for data above ^
      this.editInfoStatus = function () {
        return editInfo;
      }

      this.editInfoStatus = function () {
        return editInfo;
      }

      this.editInfoStatus = function () {
        return editInfo;
      }
	});

})();
