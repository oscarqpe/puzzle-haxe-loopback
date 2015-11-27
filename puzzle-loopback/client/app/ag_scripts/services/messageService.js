var appServices = angular.module('directoriosApp');

appServices
  .factory('messageService', function(SweetAlert,toasty){
      return {

      toastSuccess: function (title, text) {
        toasty.pop.success({
          title: title,
          msg: text,
          sound: false
        });
      },

      toastError: function (title, text) {
        toasty.pop.error({
          title: title,
          msg: text,
          sound: false
        });
      },

      toastWarning: function (title, text) {
        toasty.pop.warning({
          title: title,
          msg: text,
          sound: false
        });
      },

      toastInfo: function (title, text) {
        toasty.pop.info({
          title: title,
          msg: text,
          sound: false
        });
      },
    
      confirm: function (title, text, successCb) {
        var config = {
          title: title,
          text: text,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          cancelButtonText: "Cancelar",
        };

        this._swal(config, successCb);
      },

      _swal: function (config, successCb) {
        SweetAlert.swal(config,
          function (confirmed) {
            if (confirmed) {
              successCb();
            } 
          });
      }
    }
});