'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('indexCtrl', function ($scope, $q, $log, $cookieStore, $location, 
	$http, $routeParams, AppServices, cursoService, docenteService, parametroService) {
	
	$scope.load = function (id) {
		if (id == 1)
			$location.path("/cursos");
		else if (id == 2)
			$location.path("/silabo");
		else
			$location.path("/");
	}

	$scope.docente = {};
	
    $scope.usuario = {};
    AppServices.getUserLogged()
    .success(function (data) {
        $scope.usuario = data;
        console.log(data);
    });


});