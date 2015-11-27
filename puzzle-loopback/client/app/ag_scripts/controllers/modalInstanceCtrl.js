'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('modalInstanceCtrl', function ($scope,$modalInstance,$route,$q, $log, $cookieStore,cursoService,messageService,curso) {
    
    $scope.curso = curso;
    
    $scope.query = {
        fkIdDocente : $cookieStore.get("e_session_").idDocente
    };

    $scope.editarCurso = function () 
    {
        cursoService.actualizarCurso($scope.curso)
        .then(function (data) {
            $route.reload();
            messageService.toastSuccess('Guardado','La información del curso se guardo con éxito.');
        }).catch(function (err) {
            messageService.toastError('Error','Hubo un problema al guardar la información' + err); 
        });

        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
