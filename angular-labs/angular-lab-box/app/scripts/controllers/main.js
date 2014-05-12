'use strict';

angular.module('angularLabBoxApp')
  .controller('MainCtrl', function ($scope) {
    var tree = {
      name: 'root',
      children: [
        {
          name:'banan',
          children: [
            {
              name: 'bullen'
            },
            {
              name: 'säcken'
            }
          ]
        },
        {
          name:'forden'
        }
      ] 
    };
    $scope.anyThing = undefined;
    $scope.selectors = [{name:'banan'},{name:'apple'}]
    
  });
