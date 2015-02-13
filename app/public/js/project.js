//define(['angularAMD', 'angular-route'], function () {


'use strict';
var projectModule = angular.module('togglApp.project', ['ui.router']);

projectModule.config(function($stateProvider, $urlRouterProvider)  {
	 // For any unmatched url, send to /route1
	$stateProvider
		.state('projects', {
 			url 			: "/projects",
  			templateUrl 	: "views/partials/project.jade",
  			controller 		: 'ProjectCtrl'
  		})
	});

projectModule.controller('ProjectCtrl', ['$scope', '$http', function($scope, $http) {
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

//});