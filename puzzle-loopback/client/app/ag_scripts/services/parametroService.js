var appServices = angular.module('directoriosApp');

appServices
	.factory('parametroService', function($http, $resource, $cookieStore){
		var token = "";
		var server = "/api/"; 
		return {
			getGrupo: function (grupo) {
				return $http({
					url: server + "GrupoParametros/" + grupo,
					method: "GET",
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			getGrupos: function () {
				return $http({
					url: server + "GrupoParametros",
					method: "GET",
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			getParametrosByGrupo: function (grupo) {
				return $http({
					url: server + "Parametros",
					method: "GET",
					params: {
						filter: {
							where: {
								grupo: grupo
							}
						},
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			getParametro: function (grupo, codigo) {
				return $http({
					url: server + "Parametros/",
					method: "GET",
					params: {
						filter: {
							where: {
								grupo: grupo,
								codigo: codigo
							}
						},
						access_token: $cookieStore.get("e_session_").id
					}
				});
			}
		}
	});