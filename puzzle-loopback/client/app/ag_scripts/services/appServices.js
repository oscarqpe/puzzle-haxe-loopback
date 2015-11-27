var appServices = angular.module('appServices',['ngResource']);

appServices
	.factory('AppServices', function($http, $resource, $cookieStore){
		var token = "";
		var idUser = "";
		var server = "/api/";
		return {
			getUserLogged: function () {
				token = $cookieStore.get("e_session_").id;
				idUser = $cookieStore.get("e_session_").idUser;
				return $http({
					url: server + 'Users/' + idUser,
					method: 'GET',
					params: {
						access_token: token
					}
				});
			},
			getParamsByGrupo: function (grupo) {
				return $http({
					url: "/s/parametros/getParamsByGrupo",
					method: "GET",
					params: {
						grupo: grupo
					}
				});
			},
			login: function (user) {
				return $http({
					url: server + 'Users/login',
					method: "POST",
					data: user,
					params: {
            			include: "user"
          			}
				});
			},
			logout: function () {
				token = $cookieStore.get("e_session_").id;
				return $http({
					url: server + "Users/logout",
					method: "POST",
					params: {
						access_token: token
					}
				});
			},
			getDocentes: function () {
				return $http({
					url: server + "Docentes",
					method: "GET",
					params: {
						access_token: token
					}
				});
			},
			registrarUsuario: function (user) {
				return $http({
					url: server + "Users",
					method: "POST",
					data: user,
					params: {
            			include: "user"
          			}
				});
			},
			guardarUsuario: function (usuario) {
				return $http({
					url: server + "Users/" + $cookieStore.get("e_session_").idUser,
					method: "PUT",
					data: usuario,
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			guardarPassword: function (usuario) {
				return $http({
					url: server + "Users/" + $cookieStore.get("e_session_").idUser,
					method: "PUT",
					data: usuario,
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			}
		}
	});