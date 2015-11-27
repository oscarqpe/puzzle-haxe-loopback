var appCtrl = angular.module('appControllers', []);

appCtrl.controller('appCtrl', ['$scope', '$http', '$cookieStore', '$location',
    '$rootScope', '$compile', 'AppServices', 'cursoService', 'docenteService','messageService', 'parametroService',
    function ($scope, $http, $cookieStore, $location, $rootScope, $compile, AppServices, cursoService, docenteService, messageService, parametroService) {
        $scope.usuario = {};
        $scope.docente = {};
        $scope.cursos = {};

        $scope.showMenusAdmin = false;
        if ($cookieStore.get("e_session_conect")) {
          AppServices.getUserLogged()
          .success(function (data){
            $scope.usuario = data;
          });
          /*docenteService.getByUserId()
          .success(function (data) {
            $scope.docente = data;
          });*/
        }
        $scope.logout = function () {
          AppServices.logout()
          .success(function (data) {
            console.log(data);
            $cookieStore.remove('e_session_');
            $cookieStore.remove('e_session_conect');
            $location.path("/login");
          });
        }

    $scope.ActiveClass = function() {
      return ($location.$$path != '/login' && $location.$$path != '/registro') ? '' : 'content-login';
    };

    $scope.classRegister = function() {
      return ($location.$$path != '/registro' ) ? '' : 'hide-header';
    };

    $scope.getIncludeHeader = function(){
      
      if($location.$$path != '/login' && $location.$$path != '/registro'){
          return "views/layout/header.html";
        }
        
        return "";
    }

    $scope.getIncludeFooter = function(){
      if($location.$$path != '/login' && $location.$$path != '/registro'){
          return "views/layout/footer.html";
        }
        return "";
    }

    }]);

appCtrl.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
appCtrl.filter('capitalize', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt)
        {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});
appCtrl.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }  

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);


  var comparator = angular.equals;

  if (attrs.hasOwnProperty('checklistComparator')){
    comparator = $parse(attrs.checklistComparator)(scope.$parent);
  }

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value, comparator));
      } else {
        setter(scope.$parent, remove(current, value, comparator));
      }

      if (checklistChange) {
        checklistChange(scope);
      }
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
        scope.checked = contains(newArr, value, comparator);
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
    } else {
        scope.$parent.$watch(attrs.checklistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);
appCtrl.filter('formatterEuro', function () {
    return function(value, all) {
        var decimals = 2;
        var separators = ['.', "'", ","];
        var language = "E";
        var letter = "";
        if (language == null) 
            letter = " S/."
        else if (language == "E")
            letter = " €"
        else if (language == "P")
            letter = " S/.";
        else if (language == "US")
            letter = " $";

        decimals = decimals >= 0 ? parseInt(decimals, 0) : 2;
        separators = separators || ['.', "'", ','];
        var number = (parseFloat(value) || 0).toFixed(decimals);
        if (number.length <= (4 + decimals))
            return number.replace('.', separators[separators.length - 1]) + letter;
        var parts = number.split(/[-.]/);
        value = parts[parts.length > 1 ? parts.length - 2 : 0];
        var result = value.substr(value.length - 3, 3) + (parts.length > 1 ?
            separators[separators.length - 1] + parts[parts.length - 1] : '');
        var start = value.length - 6;
        var idx = 0;
        while (start > -3) {
            result = (start > 0 ? value.substr(start, 3) : value.substr(0, 3 + start))
                + separators[idx] + result;
            idx = (++idx) % 2;
            start -= 3;
        }
        return (parts.length == 3 ? '-' : '') + result + letter;
    }
});
appCtrl.directive('informaciongeneral', function () {
    var date = new Date();
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        templateUrl: '/views/casos/forms/informacion_general.html?_date=' + date,
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        //link: function($scope, iElm, iAttrs, controller) {

        //}
    };
});
appCtrl.directive('agregarcurso', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/agregarCurso.html?_date=' + date,
    };
});
appCtrl.directive('listacursos', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/listaCursos.html?_date=' + date,
    };
});
appCtrl.directive('editarcurso', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/curso/editar.html?_date=' + date,
    };
});

appCtrl.directive('generalperfil', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/perfil/general.html?_date=' + date,
    };
});
appCtrl.directive('socialperfil', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/perfil/social.html?_date=' + date,
    };
});
appCtrl.directive('passwordperfil', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/perfil/password.html?_date=' + date,
    };
});
appCtrl.directive('generalsilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/general.html?_date=' + date,
    };
});
appCtrl.directive('competenciassilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/competencias.html?_date=' + date,
    };
});
appCtrl.directive('contenidossilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/contenidos.html?_date=' + date,
    };
});
appCtrl.directive('estrategiassilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/estrategias.html?_date=' + date,
    };
});
appCtrl.directive('evaluacionsilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/evaluacion.html?_date=' + date,
    };
});
appCtrl.directive('bibliografiasilabo', function () {
    var date = new Date();
    // Runs during compile
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/ag_scripts/directivas/silabo/bibliografia.html?_date=' + date,
    };
});
appCtrl.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});

