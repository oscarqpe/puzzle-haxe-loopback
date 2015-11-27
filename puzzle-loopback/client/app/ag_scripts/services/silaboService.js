var appServices = angular.module('directoriosApp');

appServices
	.factory('silaboService', function($http, $resource, $cookieStore){
		var token = "";
		var server = "/api/"; 
		return {
			crearSilabo: function (silabo) {
				return $http({
					url: server + "Silabos",
					method: "POST",
					data: silabo,
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			actualizarSilabo: function (silabo) {
				return $http({
					url: server + "Silabos/" + silabo.idSilabo,
					method: "PUT",
					data: silabo,
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			getSilaboByIdCurso: function (idDocenteCurso) {
				return $http({
					url: server + "Silabos",
					method: "GET",
					params: {
						filter: {
							where: {
								fkIdDocenteCurso: idDocenteCurso
							}
						},
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			imprimirSilabo: function (contenido, silabo, docente, curso, docenteCurso) {
				console.log("Enviando para imprimir: ");
				console.log(silabo);
				return $http({
					url: server + "Silabos/imprimir",
					method: "POST",
					data: {
						data: {
							contenido: contenido,
							silabo: silabo,
							docente: docente,
							curso: curso,
							docenteCurso: docenteCurso
						}
					},
					params: {
						idSilabo: silabo.idSilabo,
						idDocente: $cookieStore.get("e_session_").idDocente,
						idCurso: contenido.general.asignatura,
						idDocenteCurso: silabo.fkIdDocenteCurso,
						access_token: $cookieStore.get("e_session_").id
					}
				});
			}
		}
	});