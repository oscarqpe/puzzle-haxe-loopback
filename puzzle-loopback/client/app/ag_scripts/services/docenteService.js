var appServices = angular.module('directoriosApp');

appServices
	.factory('docenteService', function($http, $resource, $cookieStore){
		var token = "";
		var server = "/api/"; 
		return {
			getByUserId: function () {
				token = $cookieStore.get("e_session_").id;
				var userId = $cookieStore.get("e_session_").idUser;
				return $http({
					url: server + 'Users/' + userId + "/docente",
					method: 'GET',
					params: {
						access_token: token
					}
				});
			},
			guardarDocente: function (docente) {
				return $http({
					url: server + "Docentes/" + docente.idDocente,
					method: "PUT",
					data: docente,
					params: {
						access_token: $cookieStore.get("e_session_").id
					}
				});	
			},
			getDocenteCurso: function (idCurso) {
				var where = {};
				where.fkIdDocente = $cookieStore.get("e_session_").idDocente;
				if (idCurso != null && idCurso != undefined && idCurso != "")
					where.fkIdCurso = idCurso;
				return $http({
					url: server + "DocenteCursos",
					method: "GET",
					params: {
						filter: {
							where: where
						},
						access_token: $cookieStore.get("e_session_").id
					}
				});
			},
			subirFoto: function (foto, nombreFile) {
				var fd = new FormData();
				foto.file.name = nombreFile;
				console.log(foto.file);
				fd.append('key',foto.file);
				return $http.post(
					'/api/containers/container1/upload',
					//server + service + "/subirImagen",
					//"http://localhost:8080/upload-image-brand",
					fd,
					{
						headers: {'Content-Type': undefined},
						transformRequest: angular.identity
				});
			}
		}
	});