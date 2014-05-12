'use strict';

angular.module('yotestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'local.storage'
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


