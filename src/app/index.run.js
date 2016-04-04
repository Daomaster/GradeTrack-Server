(function() {
  'use strict';

  angular
    .module('GradeTrack')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
