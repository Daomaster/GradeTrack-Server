angular
  .module('GradeTrack')
  .controller('InformationController', ["$scope",function($scope){

    $scope.classInfo = {
      id: 'CS 456',
      name: 'Automata and Formal Languages',
      info: 'Regular expressions. Regular, context-free, and unrestricted grammars. Finite and pushdown autoamata. Turing machines and the halting problem; introduction to decidability.',
      // pre: 'CS 302 and MATH 351'
    };

    $scope.profile = {
      firstName:' Lawrence ',
      lastName:' Larmore ',
      // id: ' 1244444 ',
      phone: '702-895-1096',
      email:' larmore@egr.unlv.edu',
      office: ' TBEB378B '
    }

    $scope.editInfo = false;

    $scope.toggleDisable = function()
    {
      $scope.editInfo = !$scope.editInfo;
    }

    // $scope.syllabus = [{
    //   classSection: '1001',
    //   classHour:'MW 2:30 ~ 3:45'
    // },{
    //   classSection: '1002',
    //   classHour:'TT 10:00 ~ 11:15'
    // }]

  }])
