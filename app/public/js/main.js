require.config({
    baseUrl: "",
    paths: {
        'angular'           : 'angular/angular.min',
        'angularAMD'        : 'angularAMD/angularAMD.min',
        'angular-route'     : 'angular-route/angular-route.min',
        'angular.ui.router' : 'angular-ui-router/release/angular-ui-router.min'
    },
    shim: {
        'angularAMD'    : ['angular'],
        'angular-route' : ['angular'],
        'angular.ui.router' : ['angular']
    },
    deps: ['js/app']
});