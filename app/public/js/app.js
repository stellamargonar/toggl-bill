//define(['angularAMD', 'angular.ui.router'], function (angularAMD) {

// Declare app level module which depends on views, and components
var app = angular.module('togglApp', ['ui.bootstrap', 'ui.bootstrap.datepicker','ui.bootstrap.accordion','ui.bootstrap.tpls']); //,

app.controller('MainCtrl', [ '$scope', '$http', function($scope, $http) {
	$scope.project = {};
	$scope.config = {};
	$scope.billing = {};

	$scope.computeTotalBilling = function() {
		var defaultConfig = {
			salaryPerHour 	: 8,
			salaryPerCall	: 5
		};
		var params = {
			startDate 	: new Date($scope.timeRange.start).getTime(),
			endDate		: new Date($scope.timeRange.end).getTime(),
			config 		: defaultConfig
		};
		$scope.config = defaultConfig;
		$http.get('/api/project/'+$scope.project.id+'/billing', {params:params})
		.success(function(data) {
			$scope.billing = data;
		});
	}

	$scope.clear = function() {
		$scope.billing = {};
		$scope.project = {};
	}


}]);

app.controller('ProjectsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.projects = [];
	$scope.selectedProject = {};

	$scope.timeRange = {
		start 	: new Date(),
		end 	: new Date()
	}

	var updateProjectList = function () {
		$http.get('/api/projects')
		.success(function(data) {
			$scope.projects = data.result;
	    })
	    .error(function(error) {
	    });
	}
	updateProjectList();


	$scope.searchProject = function() {

		var loadTimeEntries = function() {
			var params = {
				startDate 	: new Date($scope.timeRange.start).getTime(),
				endDate		: new Date($scope.timeRange.end).getTime()
			};
			console.log(params);
			$http.get('/api/project/' + $scope.selectedProject.id + '/timeEntries', {params:params})
			.success(function(data) {
				$scope.$parent.$parent.project.timeEntries = data.result;
				$scope.$parent.$parent.timeRange = $scope.timeRange;
			})
			.error(function(error) {
				console.log(error)
			});
		};

		$scope.$parent.$parent.clear();
		$scope.$parent.$parent.project = $scope.selectedProject;
		loadTimeEntries();
	}
}]);


app.controller('DatepickerStartCtrl', function ($scope) {
	$scope.today = function() {
    	$scope.dt = new Date();
  	};
  	$scope.today();

  	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date > new Date() ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = new Date('1980-12-12');
	};
	$scope.toggleMin();

  	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
    	$scope.opened = !$scope.opened;
  	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	$scope.format = 'yyyy/MM/dd';
	$scope.$watch('dt', function(newValue, oldValue) {
		$scope.$parent.timeRange.start=newValue;
	});
});

app.controller('DatepickerEndCtrl', function ($scope) {
	$scope.today = function() {
    	$scope.dt = new Date();
  	};
  	$scope.today();

  	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date < new Date() ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = null;
	};
	$scope.toggleMin();

  	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
    	$scope.opened = !$scope.opened;
  	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	$scope.format = 'yyyy/MM/dd';
	$scope.$watch('dt', function(newValue, oldValue) {
		$scope.$parent.timeRange.end=newValue;
	});
});



app.controller('ConfigurationCtrl', ['$scope', function($scope){
	$scope.open = false;
	$scope.accordion = true;

	$scope.configuration = {
		salaryPerHour 	: 0,
		salaryPerCall	: 0
	};

	var loadConfig = function() {
		$scope.configuration = {
			salaryPerHour : localStorage.getItem("toggl.config.hour"),
			salaryPerCall : localStorage.getItem("toggl.config.call"),
		};
	};
	loadConfig();

	$scope.saveConfig = function() {
		$scope.$parent.$parent.config = $scope.configuration;
		localStorage.setItem("toggl.config.hour", $scope.configuration.salaryPerHour);
		localStorage.setItem("toggl.config.call", $scope.configuration.salaryPerCall);
	};
}]);

app.filter('time', function() {
	return function(input) {
		var hour = Math.floor(input / 3600);
		var minutes = Math.floor((input - (hour * 3600)) / 60);
		var seconds = input - (hour * 3600) - (minutes * 60);

		var addZero = function (number) {
			if (number < 10)
				return '0'+ number;
			else
				return '' + number;
		};

		var timeString = (hour>0) ? addZero(hour) +':' : '';
		timeString += addZero(minutes) + ':';
		timeString += addZero(seconds); 
		return timeString;
	};
});

app.filter('decimal', function() {
	return function(input) {
		if(typeof input !== 'number')
			return input;
		return Math.floor(input * 100) / 100;
	};
});

app.filter('currency', function() {
	return function(input) {
		return '€ ' + input;
	};
});

