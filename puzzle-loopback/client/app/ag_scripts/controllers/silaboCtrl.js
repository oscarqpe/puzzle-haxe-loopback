'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('silaboCtrl', function ($scope, $q, $log, $cookieStore, 
    $location, $http, $routeParams, $timeout, $filter, AppServices, cursoService, docenteService, messageService
    , silaboService, parametroService) {
	$scope.silabo = {
		idSilabo: 0,
		fkIdDocenteCurso: '',
		codigo: '',
		urlArchivo: '',
		contenido: ''
	};
	$scope.contenido = {
		general: {},
		competencias: {},
		contenidos: {},
		estrategias: {},
		cronograma: {},
		evaluacion: {},
		bibliografia: {}
	};
    $scope.selected_curso = {};
    $scope.cursos = [];
    $scope.tabs = [
        {
            title: 'INFORMACION GENERAL',
            icon: 'fa fa-info',
            url: 'general'
        }, 
        {
            title: 'COMPETENCIAS Y SUMILLA',
            icon: 'fa fa-files',
            url: 'competencias'
        },
        {
            title: 'CONTENIDOS ANALITICOS',
            icon: 'fa fa-password',
            url: 'contenidos'
        },
        {
            title: 'ESTRATEGIAS Y CRONOGRAMA',
            icon: 'fa fa-password',
            url: 'estrategias'
        },
        {
            title: 'EVALUACION',
            icon: 'fa fa-password',
            url: 'evaluacion'
        },
        {
            title: 'BIBLIOGRAFIA',
            icon: 'fa fa-password',
            url: 'bibliografia'
        }
    ];
    $scope.currentTab = 'general';

    $scope.selectedTab = 0; 
       
    $scope.selectTab = function(index) {
        $scope.selectedTab = index;
    }

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    /**parametros**/
    $scope.caracteristicas = [];
    parametroService.getParametrosByGrupo("6")
    .success(function (data) {
        $scope.caracteristicas = data;
    });
    /****/

    $scope.docenteCurso =  {};
    $scope.query = {
        fkIdDocente : $cookieStore.get("e_session_").idDocente
    };
    cursoService.getCursosByIdDocente($scope.query)
    .success(function (data) {
        $scope.cursos = data;
    });

    $scope.loadDocenteCurso = function () {
        var codigoSilabo = $("#asignatura").find(':selected').attr('data-codigo')
        $scope.silabo.codigo = codigoSilabo;
    	var asignatura = $scope.contenido.general.asignatura;
    	docenteService.getDocenteCurso($scope.contenido.general.asignatura)
	    .success(function (data) {
	    	$scope.docenteCurso = data[0];
	    	$scope.silabo.fkIdDocenteCurso = data[0].idDocenteCurso;

	    	silaboService.getSilaboByIdCurso(data[0].idDocenteCurso)
		    .success(function (data) {
		    	console.log("silabo");
		    	console.log(data);
		    	if (data.length == 0) {
		    		console.log("vacio");
					$scope.silabo.idSilabo = 0;

					$scope.contenido.general = {};
					$scope.contenido.general.asignatura = asignatura;
                    /*$scope.contenido.competencias = {};
                    $scope.contenido.contenidos = {};
                    $scope.contenido.estrategias = {};
                    $scope.contenido.cronograma = {};
                    $scope.contenido.evaluacion = {};
                    $scope.contenido.bibliografia = {};
                    */
		    	} else {
			    	$scope.contenido = JSON.parse(data[0].contenido);
			    	$scope.silabo = data[0];
			    }
                $scope.contenido.general.aniolectivo = $scope.docenteCurso.anioLectivo;
		    });

		    //Info del curso
	    	cursoService.getCursoById(asignatura)
	    	 .success(function (data){
	    	 	$scope.contenido.general.teoria = data.horasTeoria;
	    	 	$scope.contenido.general.practica = data.horasPractica;
	    	 	$scope.contenido.general.teoriapractica = data.horasTeoriaPractica;
	    	 	$scope.contenido.general.creditos = data.creditos;
                $scope.selected_curso = data;
                console.log(data);
             });
        });
    };

    $scope.guardarSilabo = function () {
    	$scope.silabo.fkIdDocenteCurso = $scope.docenteCurso.idDocenteCurso;
    	$scope.silabo.contenido = JSON.stringify($scope.contenido)
    	console.log($scope.silabo);	

    	if ($scope.silabo.idSilabo == null || $scope.silabo.idSilabo == undefined || $scope.silabo.idSilabo == 0) {
	    	silaboService.crearSilabo($scope.silabo)
	    	.then(function (data) {
                console.log("Silabo Guardado: ");
                console.log(data);
                $scope.silabo = data.data;
                messageService.toastSuccess('Guardado','La información se guardo con éxito.');
                //console.log(data);
            })
            .catch(function (err) {
                messageService.toastError('Error','Hubo un problema al Guardar el silabo' + err); 
            });
	    }
	    else {
	    	silaboService.actualizarSilabo($scope.silabo)
	    	.then(function (data) {
                 messageService.toastSuccess('Actualizado','La información se actualizó con éxito.');
                console.log(data);
            })
            .catch(function (err) {
                messageService.toastError('Error','Hubo un problema al actualizar el silabo' + err); 
            });  
        }

        $scope.selected_curso.horasTeoria = $scope.contenido.general.teoria;
        $scope.selected_curso.horasPractica = $scope.contenido.general.practica;
        $scope.selected_curso.horasTeoriaPractica = $scope.contenido.general.teoriapractica;
        $scope.selected_curso.creditos = $scope.contenido.general.creditos;

        cursoService.actualizarCurso($scope.selected_curso)
        .success(function (data) {
            console.log(data);
        });
    };
    $scope.imprimirSilabo = function () {
        if ($scope.silabo.idSilabo != null && $scope.silabo.idSilabo != undefined && $scope.silabo.idSilabo != 0) {

            var docente = {};
            docenteService.getByUserId()
            .success(function (data) {
                docente = data;

                parametroService.getParametro("5", data.categoria)
                .success(function(data) {
                    docente.categoria_valor = data[0].valor;
                    parametroService.getParametro("2", data.condicion)
                    .success(function(data) {
                        docente.condicion_valor = data[0].valor;
                        parametroService.getParametro("4", data.especialidad)
                        .success(function(data) {
                            docente.especialidad_valor = data[0].valor;
                            parametroService.getParametro("3", data.regimen)
                            .success(function(data) {
                                docente.regimen_valor = data[0].valor;
                                parametroService.getParametro("1", data.grado)
                                .success(function(data) {
                                    docente.grado_valor = data[0].valor;
                                    parametroService.getParametro("6", $scope.contenido.general.caracteristica)
                                    .success(function(data) {
                                        var caracteristica_valor = data[0].valor;
                                        cursoService.getCursoById($scope.contenido.general.asignatura)
                                        .success(function (data) {
                                            var curso = data;
                                            curso.caracteristica_valor = caracteristica_valor;
                                            silaboService.imprimirSilabo(
                                                $scope.contenido, 
                                                $scope.silabo, 
                                                docente,
                                                curso,
                                                $scope.docenteCurso)
                                            .success(function (data) {
                                                console.log(data);
                                                var url = "http://latex.aslushnikov.com/compile?url=http://45.55.33.13:3000/tmp/" + data.data + ".tex";
                                                $scope.silabo.urlArchivo = url;
                                                silaboService.actualizarSilabo($scope.silabo)
                                                .success(function (data) {
                                                    window.open(url,'_blank');
                                                })
                                                .error(function (err) {
                                                    messageService.toastWarning("Alerta", "No se pudo crear el silabo actualice la pagina e intente nuevamente.");
                                                });
                                            })
                                            .error(function (err) {
                                                messageService.toastWarning("Alerta", "No se pudo crear el silabo actualice la pagina e intente nuevamente.");
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                    
                });
            });
        }
        else {
            messageService.toastWarning("Warning!", "Este curso aun no tiene guardado un silabo.");
        }
    };


    //Competencias
    $scope.contenido.competencias.genericas = [];
	$scope.addGenerica = function(){
	    $scope.contenido.competencias.genericas.push({
	    	descripcion: ""
	    });	   	
    };

    $scope.quitarGenerica = function(index){
       	$scope.contenido.competencias.genericas.splice(index,1)
    }

    $scope.contenido.competencias.especificas = [];
	$scope.addEspecifica = function(){
	    $scope.contenido.competencias.especificas.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarEspecifica = function(index){
       	$scope.contenido.competencias.especificas.splice(index,1)
    }

    //sumilla
    $scope.contenido.competencias.sumilla = [];
	$scope.addSumilla = function(){
	    $scope.contenido.competencias.sumilla.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarSumilla = function(index){
       	$scope.contenido.competencias.sumilla.splice(index,1)
    }

    //Bibliografia
    $scope.contenido.bibliografia.basica = [];
	$scope.addBasica = function(){
	    $scope.contenido.bibliografia.basica.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarBasica = function(index){
       	$scope.contenido.bibliografia.basica.splice(index,1)
    }
 
	$scope.contenido.bibliografia.especializada = [];	
	$scope.addEspecializada = function(){
	    $scope.contenido.bibliografia.especializada.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarEspecializada = function(index){
       	$scope.contenido.bibliografia.especializada.splice(index,1)
    }

    //Contenidos analiticos
    $scope.contenido.contenidos = [];	
	$scope.addContenidos = function(){
	    $scope.contenido.contenidos.push({
	    	conceptual: "",
	    	procedimental: "",
	    	actitudinal: "",
	    	hora: "",
	    	porcentaje: "",
	    	fecha: ""
	    });
    };

    $scope.quitarContenidos = function(index){
       	$scope.contenido.contenidos.splice(index,1)
    }

    //Estrategias
    $scope.contenido.estrategias.pedagogicas = [];
	$scope.addEstrategia = function(){
	    $scope.contenido.estrategias.pedagogicas.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarEstrategia = function(index){
       	$scope.contenido.estrategias.pedagogicas.splice(index,1)
    }

    //Cronograma
    $scope.contenido.cronograma.fechas = [];
    $scope.addFechaTeoria = function(){
        $scope.contenido.cronograma.fechas.push(
            {
                teoria: "",
                practica: ""
            }
        );
    };

    $scope.quitarFechaTeoria = function(index){
        $scope.contenido.cronograma.fechas.splice(index,1)
    }
    /*
    $scope.contenido.cronograma.fechaTeoria = [];
	$scope.addFechaTeoria = function(){
	    $scope.contenido.cronograma.fechaTeoria.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarFechaTeoria = function(index){
       	$scope.contenido.cronograma.fechaTeoria.splice(index,1)
    }*/

    $scope.contenido.cronograma.fechaPractica = [];
	$scope.addFechaPractica = function(){
	    $scope.contenido.cronograma.fechaPractica.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarFechaPractica = function(index){
       	$scope.contenido.cronograma.fechaPractica.splice(index,1)
    }

    //Evaluacion
    $scope.contenido.evaluacion.items = [];
	$scope.addEvaluacion = function(){
	    $scope.contenido.evaluacion.items.push({
	    	descripcion: ""
	    });
    };

    $scope.quitarEvaluacion = function(index){
       	$scope.contenido.evaluacion.items.splice(index,1)
    }

    //Calendario
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    
    $scope.opened = [];
    $scope.openedFin = [];

    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd/MM/yyyy','dd-MMMM-yyyy', 'dd.MM.yyyy'];
    $scope.format = $scope.formats[0];

    $scope.open = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
          $scope.opened[index] = true;
        });
    };

    $scope.openFin = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
          $scope.openedFin[index] = true;
        });
    };

});