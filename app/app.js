'use strict';

// Declare app level module which depends on views, and components
angular.module('toggleApp', [
  'ngRoute',
  'toggleApp.project'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/project'});
}]);
