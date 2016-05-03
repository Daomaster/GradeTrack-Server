
(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .service('InfoService', function() {
      // ==========
      // firebase data
      // ==========
      

      // ==========
      // UI data
      // ==========
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
