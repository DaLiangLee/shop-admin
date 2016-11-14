/**
 * Created by Administrator on 2016/10/18.
 */
(function () {
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
    function cbDialog($rootScope, $modal, $modalStack, cbDialogConfig) {
        var showDialog = function (e) {
                var r = {
                        backdrop: "static"
                    },
                    i = angular.extend({}, r, e),
                    s = $modal.open(i);
                return s;
            },
            showDialogByUrl = function (e, t, r) {
                var i, o,
                    u = {
                        templateUrl: e,
                        resolve: {
                            passedObject: function () {
                                return r
                            }
                        },
                        controller: ["$scope", "$modalInstance", "$rootScope", "$modalStack", "passedObject", function (e, r, s, u, a) {
                            o = e.$on("$locationChangeSuccess", function () {
                                i && e._dialogShow == 1 && e.close(!1)
                            });
                            var f = "icon-warning-2";
                            a != undefined && a.iconClass && (f = a.iconClass);
                            var l = "text-warning";
                            a != undefined && a.iconColor && (l = a.iconColor), e.iconClass = f + " " + l, e._passedObject = a, e._dialogShow = !0, e.close = function (t) {
                                e._dialogShow = !1, r.close(t), i = null
                            }, angular.isFunction(t) && t(e)
                        }]
                    };
                r && r.windowClass && (u.windowClass = r.windowClass), i = showDialog(u);
                var a = function (e) {
                    return o && o(), e
                };
                return i.result.then(function (e) {
                    return a(e)
                }, function (e) {
                    return a(e)
                }), i
            },
            showMessageDialog = function (e, t, r) {
                var s = "app/components/dialog/dialog.html",
                    u = cbDialogConfig.defaultButtonConfig;
                t = t || e.callback;
                r = r || e.passedObject;
                var a = e.buttons || u,
                    f = function (r) {
                        r.title = e.title;
                        r.message = e.message;
                        r.buttons = a;
                        r.eventHandler = function (e) {
                            r.close(e);
                        };
                        angular.isFunction(t) && t(r)
                    };
                return showDialogByUrl(s, f, r);
            },
            showMessageDialogSimple = function (e, t, n, r) {
                return showMessageDialog({
                    title: e,
                    message: t,
                    buttons: n,
                    passedObject: r
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