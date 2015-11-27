'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('registroCtrl', function ($scope, $q, $log, $cookieStore, 
	$location, $http, $routeParams, User, AppServices, cursoService, docenteService) {
	var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;
	$scope.user_login = {};
	$scope.usuario = {};
	//$scope.usuario.usuario = {};
	$scope.registrar =  function () {
		$scope.usuario.idDocente = 0;
		$scope.usuario.usuario.nombres = $scope.usuario.nombres;
		AppServices.registrarUsuario($scope.usuario.usuario)
		.success(function (data) {
			$scope.user_login.username = data.username;
			$scope.user_login.password = $scope.usuario.usuario.password;
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
	        //$location.path("/perfil");
		}).error(function (err) {
			console.log(err);
			alert(err.error.message);
		});
	}
});