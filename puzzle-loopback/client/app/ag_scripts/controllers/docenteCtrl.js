'use strict';

var appCtrl = angular.module('directoriosApp');

appCtrl.controller('docenteCtrl', function ($scope, $q, $log, $cookieStore, 
    $location, $http, $routeParams, AppServices, cursoService, docenteService, messageService
    , parametroService, FileUploader) {
	
	var uploader = $scope.uploader = new FileUploader({
      scope: $scope,                          // to automatically update the html. Default: $rootScope
      url: '/api/containers/container1/upload',
      formData: [
        { key: 'value' }
      ]
    });
	
    $scope.usuario = {};
    $scope.docente = {};
    
    $scope.tabs = [
        {
            title: 'General',
            icon: 'fa fa-info',
            url: 'general'
        }, 
        {
            title: 'Social',
            icon: 'fa fa-files',
            url: 'social'
        },
        {
            title: 'Contraseña',
            icon: 'fa fa-password',
            url: 'password'
        }
    ];
    $scope.currentTab = 'general';

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

    /**parametros**/
    $scope.grados = [];
    parametroService.getParametrosByGrupo("1")
    .success(function (data) {
        $scope.grados = data;
    });
    $scope.condiciones = [];
    parametroService.getParametrosByGrupo("2")
    .success(function (data) {
        $scope.condiciones = data;
    });
    $scope.regimenes = [];
    parametroService.getParametrosByGrupo("3")
    .success(function (data) {
        $scope.regimenes = data;
    });
    $scope.especialidades = [];
    parametroService.getParametrosByGrupo("4")
    .success(function (data) {
        $scope.especialidades = data;
    });
    $scope.categorias = [];
    parametroService.getParametrosByGrupo("5")
    .success(function (data) {
        $scope.categorias = data;
    });
    /****/
    
    docenteService.getByUserId()
    .success(function (data) {
        $scope.docente = data;
        console.log("DATA", data);
    });
    
    AppServices.getUserLogged()
    .success(function (data) {
        $scope.usuario = data;
        if (data.photo == null || data.photo == '') {
            $scope.usuario.photo = "../../images/default.jpg";
            console.log("USER",data);
        };
        
    });

    $scope.guardar = function () {
        docenteService.guardarDocente($scope.docente)
        .success(function (data) {
            $scope.subirFoto();
            AppServices.guardarUsuario($scope.usuario)
            .then(function (data) {
                $location.path("/perfil");
                messageService.toastSuccess('Guardado','La información se guardo con éxito.');
            })
            .catch(function (err) {
            messageService.toastError('Error','Hubo un problema al actualizar la información' + err); 
            });  
        })
    };

    $scope.guardarSocial = function () {
        AppServices.guardarUsuario($scope.usuario)
        .then(function (data) {
            $location.path("/perfil");
            messageService.toastSuccess('Guardado','La información se guardo con éxito.');
        })
        .catch(function (err) {
            messageService.toastError('Error','Hubo un problema al guardar la información' + err); 
        });
    };

    $scope.password = {};
    $scope.guardarPassword = function () {
        AppServices.guardarPassword($scope.password)
        .then(function (data) {
            messageService.toastSuccess('Guardado','La información se guardo con éxito.');
            $location.path("/perfil");
        })
        .catch(function (err) {
            messageService.toastError('Error','Hubo un problema al guardar la información' + err); 
        });
    };

   $scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
        $scope.usuario.photo = e.target.result;
     });
    }

    $scope.user_photo = {};
    $scope.subirFoto = function () {
        var date = new Date().toISOString();
        var nombreFile = $scope.usuario.email + date.toString();
        docenteService.subirFoto($scope.user_photo, nombreFile)
        .success(function (data) {
            console.log(data);
            // /api/containers/container1/download/Selección_001.png
            var imagen = data.result.files.key[0];
            $scope.usuario.photo = "/api/containers/container1/download/" + imagen.name;
            AppServices.guardarUsuario($scope.usuario)
            .success(function (data) {
                console.log(data);
            });
        });
    }
});