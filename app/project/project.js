'use strict';

angular.module('toggleApp.project', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/project', {
    templateUrl: 'project/project.html',
    controller: 'ProjectCtrl'
  });
}])

.controller('ProjectCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.projects = [{name:'project1', id:12}];

	$scope.updateProjectList = function () {
		$http.get('/api/projects')
		.success(function(data) {
			console.log("RECEIVED:");
			console.log(data);
			$scope.projects = data;
	    })
	    .error(function(error) {
	    	console.log("ERROR");
	    	console.log(error);
	    });
	}

  }]);