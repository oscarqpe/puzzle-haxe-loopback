'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('cursoCtrl', function ($scope, $q, $log, $cookieStore, 
    $location, $http, $routeParams, $modal, AppServices, cursoService, docenteService, messageService) {
    $scope.cursos = [];
    $scope.curso = {
        idCurso: 0,
        fkIdEscuela: 1
    };
    $scope.tabs = [
        {
            title: 'Registros',
            icon: 'fa fa-info',
            url: 'registros'
        }, 
        {
            title: 'Agregar',
            icon: 'fa fa-files',
            url: 'agregar'
        }
    ];
    $scope.currentTab = 'registros';
    $scope.selectedTab = 0; 
       
    $scope.selectTab = function(index){
        $scope.selectedTab = index;
    }
    
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
    console.log($scope.$parent.docente.idDocente);
    $scope.query = {
        fkIdDocente : $cookieStore.get("e_session_").idDocente
    };
    cursoService.getCursosByIdDocente($scope.query)
    .success(function (data) {
        $scope.cursos = data;
        console.log(data);
    });

    $scope.guardarCurso = function () {
        cursoService.registrarCurso($scope.curso)
        .then(function (data) {
            cursoService.getCursosByIdDocente($scope.query)
            .success(function (data) {
                $scope.cursos = data;
            });
            messageService.toastSuccess('Guardado','La información del curso se guardo con éxito.');
        }).catch(function (err) {
            messageService.toastError('Error','Hubo un problema al guardar la información' + err); 
        });
    }

    $scope.animationsEnabled = true;

    $scope.openEditar = function (curso) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalEditar',
            controller: 'modalInstanceCtrl',
            //size: '',
            resolve: {
             curso: function () { //scope del modal
               return curso;
            }
          }
        });
    }

    $scope.openEliminar = function(idcurso){
        messageService.confirm(
            '¿Está seguro?',
            'Se eliminarán toda la información relacionada con la asignatura',
            function(){
                cursoService.eliminarCurso(idcurso)
                    .then(function (data) {
                        messageService.toastSuccess('Guardado','La información del curso se guardo con éxito.');
                    }).catch(function (err) {
                        messageService.toastError('Error','Hubo un problema al eliminar la asignatura ' + err); 
                });
            },
            function () {
                cancelCb();
              }
        );
    }

});