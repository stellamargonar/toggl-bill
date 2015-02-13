//define(['angularAMD', 'angular.ui.router'], function (angularAMD) {

// Declare app level module which depends on views, and components
var app = angular.module('togglApp', ['ui.router', 'togglApp.project']); //,
  //'togglApp.project'

app.config(function($stateProvider, $urlRouterProvider)  {
	 // For any unmatched url, send to /route1
  	$urlRouterProvider.otherwise("/projects");
});

//    return angularAMD.bootstrap(app);
//});