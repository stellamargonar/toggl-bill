'use strict';

angular.module('toggleApp.project', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/project', {
    templateUrl: 'project/project.html',
    controller: 'ProjectCtrl'
  });
}])

.controller('ProjectCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.stella = "Stella MArg.";
	$http.get('toggle/projects.json').success(function(data) {
      $scope.projects = data;
    });

  }]);