var appServices = angular.module('directoriosApp');

appServices
	.factory('cursoService', function($http, $resource, $cookieStore){
		var token = "";
		var server = "/api/";
		return {
			registrarCurso: function (curso) {
				token = $cookieStore.get("e_session_").id;
				var data = {
					curso: curso,
					idDocente: $cookieStore.get("e_session_").idDocente
				};
				return $http({
					url: server + 'Cursos/Registrar',
					method: 'POST',
					data: {
						data: data
					},
					params: {
						access_token: token
					}
				});
			},
			getCursosByIdDocente: function () {
				token = $cookieStore.get("e_session_").id;
				var idDocente = $cookieStore.get("e_session_").idDocente;
				return $http({
					url: server + 'Docentes/' + idDocente + "/cursos",
					method: "GET",
					params: {
						access_token: token
					}
				});
			},
			getCursoById: function(curso){
				token = $cookieStore.get("e_session_").id;
				return $http({
					url: server + 'Cursos/'+ curso,
					method: "GET",
					params: {
						access_token: token
					}
				});
			},
			actualizarCurso: function (curso) {
				token = $cookieStore.get("e_session_").id;
				return $http({
					url: server + "Cursos/" + curso.idCurso,
					method: "PUT",
					data: curso,
					params: {
						access_token: token
					}
				});
			},
			eliminarCurso: function(idCurso){  //permitir eliminar en cascada
				token = $cookieStore.get("e_session_").id;
				return $http({
					url: server + "Cursos/" + idCurso,
					method: "DELETE",
					data: idCurso,
					params: {
						access_token: token
					}
				});	
			}
		}
	});