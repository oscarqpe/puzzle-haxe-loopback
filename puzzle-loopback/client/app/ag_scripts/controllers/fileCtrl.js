'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('fileCtrl', function ($scope, $q, $log, $cookieStore, $location, $http, $routeParams, AppServices) {
	$scope.saludo = "RCORP UNSA";		
});