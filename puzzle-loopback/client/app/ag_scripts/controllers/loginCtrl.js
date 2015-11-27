'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('loginCtrl', function ($scope, $q, $log, $cookieStore, 
	$location, $http, $routeParams, User, AppServices, cursoService, docenteService) {
	var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;
	$scope.user_login = {};
	$scope.user_login.ttl = TWO_WEEKS;
	$scope.access_token = "";
	$scope.docentes = [];
	$scope.login = function () {
		console.log($scope.user_login);
		console.log('Ricardocorp');
		/*
		$scope.loginResult = User.login($scope.user_login,
			function(data) {
				console.log(data);
			}, function(res) {
			// error
			console.log(res);
		});
		*/
		
		AppServices.login($scope.user_login)
		.success(function (data) {
			console.log(data);
			$scope.access_token = data.id;
			$scope.e_session_ = {};
			$scope.e_session_.id = data.id
	        $scope.e_session_.ttl = data.ttl;
	        $scope.e_session_.created = data.created;
	        $scope.e_session_.idUser = data.userId;
	        $scope.$parent.usuario = data.user;
	        $cookieStore.put('e_session_', $scope.e_session_);
	        $cookieStore.put('e_session_conect', true);
	        $location.path("/");
		})
		.error(function (err) {
			alert(err.error.message);
		});
	};
	$scope.getDocentes = function () {
		AppServices.getDocentes($scope.access_token)
		.success(function (data) {
			$scope.docentes = data;
		});
	}
});