'use strict';
/* global app:true */

var app = angular.module('directoriosApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'lbServices',
    'appServices',
    'appControllers',
    'ui.bootstrap',
    'oitozero.ngSweetAlert',
    'ngAnimate',
    'ngTouch',
    'toasty',
	'angularFileUpload'
]);

app.run(function($rootScope, $location, $cookieStore, $http){
    $rootScope.$on('$routeChangeStart', function (event,next,current) {
        if ($cookieStore.get('e_session_conect') == false || $cookieStore.get('e_session_conect') == null){
            if (next.templateUrl == "views/registro.html")
                $location.path("/registro");
            else
                $location.path("/login");
        }else{
            if (next.templateUrl == "views/login.html"){
                $location.path("/perfil");
            }
        }
    });
}).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/index.html',
            controller: "indexCtrl"
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: "loginCtrl"
        })
        .when('/registro', {
            templateUrl: 'views/registro.html',
            controller: "registroCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
})
.factory('authHttpResponseInterceptor',['$q','$location', '$cookieStore',function($q,$location,$cookieStore){
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $cookieStore.remove('e_session_');
                $cookieStore.remove('e_session_conect');   
                $location.path('/login');//.search('returnTo', $location.path());
            }
            return $q.reject(rejection);
        }
    }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);
//.constant('FIREBASE_URL', 'https://[PUT-YOUR-FIREBASE-URL-HERE].firebaseio.com/');
