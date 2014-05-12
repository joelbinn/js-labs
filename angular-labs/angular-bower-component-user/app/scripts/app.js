'use strict';

angular
  .module('angularBowerComponentUserApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'bananas.testNgBowerComponent'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
