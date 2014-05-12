'use strict';

angular.module('yotestApp')
	  .controller('MainCtrl', function ($scope, $q, $http, $timeout, LocalStorage) {
		console.log("Starting MainCtrl");
		window.q = $q;
		window.http=$http;
		window.timeout=$timeout;
		window.storage = LocalStorage;
		var n = LocalStorage.get('n') || 1;

		function takeSnap(){
			console.log("Saving: ", $scope.awesomeThings);
	        LocalStorage.put('n', n);
	        LocalStorage.put('current', $scope.awesomeThings);
			$timeout(takeSnap, 1000*60);
		};
		
		var initialValue = LocalStorage.get('current');
		console.log('persisted value:', initialValue);
	    $scope.awesomeThings = initialValue || [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	
	    $scope.addItem = function() {
			$scope.awesomeThings.push(n);
			n++;
	    };
	
        LocalStorage.put('original', $scope.awesomeThings);
		takeSnap();
	  });
