angular
  .module('GradeTrack')
.directive("timeline", function () {
  return {
    restrict: "E",
    replace: true,
    template:'<div></div>',
    scope:{
      items: '=items',
      options: '=options'
    },
    link: function (scope, element) {




      // Create a Timeline
     new vis.Timeline(element[0], scope.items, scope.options);


    }
  };
});
