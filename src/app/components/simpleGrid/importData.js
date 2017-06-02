(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('importData', importData)
        .directive('simpleFile', simpleFile);

    // 获取接口
    function getRequest(api, webSiteApi, configuration){
        var WEB_SITE_API = webSiteApi.WEB_SITE_API;
        api = api.split(',');
        if(api.length !== 3){
            throw Error("传递配置参数不是3个");
        }
        var params = WEB_SITE_API[api[0]][api[1]][api[2]];
        if(_.isEmpty(params)){
            throw Error("api.js配置和传入参数不对应");
        }
        return configuration.getAPIConfig() + params.url;
    }

    function importData($timeout, webSiteApi, configuration) {

        return {
            restrict: 'A',
            scope: {
                params: "=",
                uploadExcel: "&"
            },
            templateUrl: 'app/components/simpleGrid/importData.html',
            controller: function($scope, $element, $attrs) {
                this.importData = $scope.params;
                this.uploadExcel = function(data){
                    $scope.uploadExcel(data);
                };
                this.hideItems = function () {
                    $scope.isItemsShow = false;
                }
                // console.log('$attrs', $attrs);
            },
            link: function(scope, iElement, iAttrs) {
                // scope.hintText = "请选择EXCEL文件上传";

                scope.isItemsShow = false;

                scope.toggleItems = function() {
                    scope.isItemsShow = !scope.isItemsShow;
                };

                scope.download = function () {
                    // var downloadUrl = scope.params.download; // 下载模版地址
                    // console.log('download site', downloadUrl)
                    // return getRequest(downloadUrl, webSiteApi, configuration); // '/admin/static/user.xls'
                    return configuration.getAPIConfig(true) + '/static/user.xls';
                };
            }
        };
    }

    function simpleFile($timeout, $log, cbDialog, configuration, webSiteApi, webSiteVerification) {

        var DEFAULT_DATA = {
            uid: 0,
            fileNumLimit: 1,
            fileSizeLimit: 3 + "mb"
        };
        return {
            restrict: "A",
            require: '?^importData',
            link: function(scope, iElement, iAttrs, ctrl) {

               var importData = ctrl.importData;
               var importUrl = getRequest(importData.import, webSiteApi, configuration); // http://localhost:3000/shopservice/admin/file/add_user

                /**
                 * config 配置默认参数
                 * @type {any}
                 */
                var config = angular.extend({}, DEFAULT_DATA, scope.config || {});
                config.fileNumLimit = iAttrs.valueMax * 1 || 1;
                var fileType = webSiteVerification.UPLOAD[iAttrs.simpleFile || 'excel'];
                var uploadType = iAttrs.uploadType || "";
                // console.log('uploadType', fileType);
                var getUploadParam = {};
                var upload;

                function handler(childScope) {
                    var results = [];
                    var start, add;
                    var isClear = true;
                    var isError = false;
                    childScope.title = iAttrs.title;
                    childScope.getUploadParam = getUploadParam;
                    childScope.items = [];
                    childScope.postInit = false;
                    $log.debug(upload);
                    $timeout(function () {
                        start = angular.element('#startUpload');
                        add = angular.element('#addFiles');
                        upload = new plupload.Uploader({
                            runtimes: 'html5,flash,silverlight,html4',
                            browse_button: 'addFiles',
                            multiple_queues: true,
                            chunk_size: '1mb',
                            filters: {
                                max_file_size: config.fileSizeLimit,
                                // Specify what files to browse for
                                mime_types: [
                                    fileType
                                ]
                            },
                            views: {
                                list: true,
                                thumbs: true, // Show thumbs
                                active: 'thumbs'
                            },
                            file_data_name: 'file',
                            container: document.getElementById('j-upload-container'),
                            flash_swf_url: configuration.getStatic() + '/assets/upload/Moxie.swf',
                            silverlight_xap_url: configuration.getStatic() + '/assets/upload/Moxie.xap',
                            url: importUrl // 上传地址
                        });
                        upload.init();
                        upload.bind('PostInit', function (up) {
                            $log.debug('PostInit');
                            start.on('click', function () {
                                if (!angular.element(this).hasClass('upload-disabled')) {
                                    angular.element(this).parents('.btns').remove();
                                    up.setOption({
                                        'multipart_params': {
                                            "file": "file"
                                        }
                                    });
                                    up.start();
                                }
                            });
                            childScope.postInit = true;
                            scope.$apply();
                        });
                        upload.bind('BeforeUpload', function (up, file) {
                            $log.debug('init');
                        });
                        upload.bind('FilesAdded', function (up, files) {
                            childScope.danger = "";
                            console.log('FilesAdded', up, files);
                            if (upload.total.queued >= config.fileNumLimit) {
                                console.log(config.fileNumLimit, upload.total.queued);
                                var div = add.siblings('div');
                                add.addClass('upload-disabled').prop('disabled', true).css({
                                    'position': 'absolute',
                                    'left': div.css('left'),
                                    'top': div.css('top'),
                                    'z-index': 10
                                });
                            }
                            start.removeClass('upload-disabled').prop('disabled', false).click();
                            angular.forEach(files, function (file) {
                                childScope.items.push({
                                    id: file.id,
                                    name: file.name,
                                    progress: 0,
                                    size: plupload.formatSize(file.size)
                                });
                            });
                            config.uid++;
                            scope.$apply();
                        });

                        upload.bind('UploadProgress', function (up, file) {
                            $log.debug('UploadProgress', file.percent);
                            var index = _.findIndex(childScope.items, {id: file.id});
                            childScope.items[index].progress = file.percent;
                            scope.$apply();
                        });
                        upload.bind('FileUploaded', function (up, file, info) { // info是后台返回的数据
                            $log.debug('FileUploaded', info.status, file);
                            console.log('info',info);
                            if (info.status == 200) {
                                results = angular.fromJson(info.response);
                            }

                        });
                        upload.bind('UploadComplete', function (up, file, info) {
                            $log.debug('UploadComplete', info);
                            if (isClear && !isError) {
                                console.log(results);
                                // childScope.close();
                                $timeout(function () {
                                    scope.uploadExcel({data: {"status":"0", "data": results}}); // 完成后调用这个函数
                                    childScope.close();
                                }, 2000);
                            }
                            start.addClass('upload-disabled');
                            scope.$apply();
                        });
                        upload.bind('Error', function (up, err) {
                            console.log('Error', err);
                            console.log('Error', err.message);
                            console.log(err.status);
                            if (err.code == -600) {
                                childScope.danger = "文件超过" + config.fileSizeLimit + "，请重新选择上传";
                            }
                            if (err.status == 403) {
                                childScope.danger = "上传过期，请重新选择文件上传";
                                $timeout(function () {
                                    childScope.close();
                                }, 3000);
                            }
                            if (err.code == -601) {
                                childScope.danger = "上传文件类型错误,请重新选择文件上传";
                            }
                            if (err.code == -200) {
                                childScope.danger = "网络错误";
                            }
                            scope.$apply();
                        });
                    }, 1);

                    childScope.remove = function (item) {
                        upload.removeFile(item.id);
                        _.remove(childScope.items, {id: item.id});
                    };

                }

                /**
                 * 点击按钮
                 */
                iElement.click(function (t) {
                    if(!uploadType){
                        throw Error('上传的API类型不存在');
                    }
                    ctrl.hideItems();
                    cbDialog.showDialogByUrl("app/components/cbUploadFile/cbUploadFile.html", handler, {
                        windowClass: "viewFramework-upload-file-dialog"
                    });
                    t.preventDefault();
                    t.stopPropagation();
                });
            }
        };
    }
})();
