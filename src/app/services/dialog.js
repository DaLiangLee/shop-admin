/**
 * Created by Administrator on 2016/10/18.
 */
(function(){
  'use strict';

  angular
    .module('shopApp')
    .provider('cbDialogConfig', cbDialogConfig)
    .factory('cbDialog', cbDialog);


  /** @ngInject */
  function cbDialogConfig() {
    var data = {
      defaultButtonConfig: [
        {
          result: true,
          label: "确定",
          cssClass: "btn-primary"
        },
        {
          result: false,
          label: "取消",
          cssClass: "btn-default"
        }
      ]
    };
    return {
      setButtonLabels: function (t) {
        angular.forEach(data.defaultButtonConfig, function (e, n) {
          e.label = t[n]
        })
      },
      setProviderOptions: function (t) {
        angular.extend(data, t)
      },
      $get: function () {
        return data;
      }
    }
  }

  /** @ngInject */
  function cbDialog($rootScope, $window, $document, $timeout, $modal, $modalStack, cbDialogConfig) {
    var body = $document.find('body');
    var bodyPad;
    var showDialog = function (config) {
        bodyPad = parseInt((body.css('padding-right') || 0), 10);
        body.css({'overflow': 'hidden','padding-right': $window.innerWidth - body[0].clientWidth + bodyPad});
        return $modal.open(angular.extend({}, {
          backdrop: "static"
        }, config));
      },
      showDialogByUrl = function (template, handler, passedConfig) {
        var showdialogload,
          locationChangeSuccess,
          config = {
            templateUrl: template,
            resolve: {
              passedObject: function () {
                return passedConfig;
              }
            },
            controller: ["$scope", "$modalInstance", "$rootScope", "$modalStack", "passedObject",
              function ($scope, $modalInstance, $rootScope, $modalStack, passedObject) {
                locationChangeSuccess = $scope.$on("$locationChangeSuccess", function () {
                  showdialogload && $scope._dialogShow == 1 && $scope.close(false) && resetScrollbar();
                });
                var icon = "icon-warning-2";
                passedObject != undefined && passedObject.iconClass && (icon = passedObject.iconClass);
                var textColor = "text-warning";
                passedObject != undefined && passedObject.iconColor && (textColor = passedObject.iconColor);
                $scope.iconClass = icon + " " + textColor;
                $scope._passedObject = passedObject;
                $scope._dialogShow = true;
                $scope.close = function (event) {
                  $scope._dialogShow = false;
                  $modalInstance.close(event);
                  showdialogload = null;
                };
                angular.isFunction(handler) && handler($scope);
              }]
          };
        passedConfig && passedConfig.windowClass && (config.windowClass = passedConfig.windowClass);
        showdialogload = showDialog(config);
        var resultFn = function (result) {
          var timer = $timeout(function(){
            resetScrollbar();
            $timeout.cancel(timer);
          },300, false);
          return locationChangeSuccess && locationChangeSuccess(), result;
        };
        var resetScrollbar = function(){
          body.css({'overflow': '','padding-right': ''});
        };
        return showdialogload.result.then(function (result) {
          return resultFn(result);
        }, function (error) {
          return resultFn(error);
        }), showdialogload;
      },
      showMessageDialog = function (config, callback, passedObject) {
        var template = "app/components/dialog/message.html",
          defaultButtonConfig = cbDialogConfig.defaultButtonConfig;
          callback = callback || config.callback;
          passedObject = passedObject || config.passedObject;
        var handler = function (child) {
            child.title = config.title;
            child.message = config.message;
            child.buttons = config.buttons || defaultButtonConfig;
            child.eventHandler = function (e) {
              child.close(e);
            };
            angular.isFunction(callback) && callback(passedObject)
          };
        return showDialogByUrl(template, handler, passedObject);
      },
      showMessageDialogSimple = function (title, message, buttons, passedObject) {
        return showMessageDialog({
          title: title,
          message: message,
          buttons: buttons,
          passedObject: passedObject
        });
      };
    return {
      showDialog: showDialog,
      showDialogByUrl: showDialogByUrl,
      showMessageDialog: showMessageDialog,
      showMessageDialogSimple: showMessageDialogSimple
    }
  }

})();
