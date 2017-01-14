/**
 * Created by Administrator on 2016/11/3.
 */
(function() {
  /**
   * 留言板   支持编辑和留言2种功能
   * message    只能查看数据
   * content    编写数据
   * config     配置信息
   *
   */
  'use strict';

  angular
    .module('shopApp')
    .directive('cbUploadFile', cbUploadFile);

  /** @ngInject */
  function cbUploadFile($http, $timeout,$log, cbDialog, configuration, webSiteApi, webSiteVerification){
    var API = webSiteApi.WEB_SITE_API['upload'];

    //var URL = 'http://192.168.2.11:9090/shopservice/admin';
    var URL = configuration.getAPIConfig();

    var DEFAULT_DATA = {
      uid: 0,
      fileNumLimit: 1,
      fileSizeLimit: 3 + "mb"
    };
    return {
      restrict: "A",
      scope: {
        config: "=",
        uploadItem: '&'
      },
      link: function(scope, iElement, iAttrs){
        /**
         * config 配置默认参数
         * @type {any}
         */
        var config = angular.extend({}, DEFAULT_DATA, scope.config || {});
        config.fileNumLimit = iAttrs.valueMax * 1 || 1;
        var fileType = webSiteVerification.UPLOAD[iAttrs.cbUploadFile || 'images'];
        var uploadType = iAttrs.uploadType || "";
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
              runtimes : 'html5,flash,silverlight,html4',
              browse_button : 'addFiles',
              multiple_queues: true,
              chunk_size: '1mb',
              filters: {
                max_file_size : config.fileSizeLimit,
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
              container: document.getElementById('j-upload-container'),
              flash_swf_url : configuration.getStatic() + '/assets/upload/Moxie.swf',
              silverlight_xap_url : configuration.getStatic() + '/assets/upload/Moxie.xap',
              url : 'http://oss.aliyuncs.com'
            });
            upload.init();
            upload.bind('PostInit', function (up) {
              $log.debug('PostInit');
              start.on('click', function () {
                if(!angular.element(this).hasClass('upload-disabled')){
                  angular.element(this).parents('.btns').remove();
                  setUploadParam(up, config.uid++);
                }
              });
              childScope.postInit = true;
              scope.$apply();
            });
            upload.bind('BeforeUpload', function (up, file) {
              $log.debug('init');
              setUploadParam(up, config.uid++);
            });
            upload.bind('FilesAdded', function (up, files) {
              childScope.danger = "";
              if(upload.total.queued >= config.fileNumLimit){
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
            upload.bind('FileUploaded', function (up, file, info) {
              $log.debug('FileUploaded', info.status, file);
              if (info.status == 200) {
                results.push({
                  id: file.id,
                  url: up.getOption().url +"/"+　up.getOption().multipart_params.key,
                  name: file.name,
                  uid: up.getOption().multipart_params.uid
                });
              }else{
                $log.debug(up, file, info.status);
              }
            });
            upload.bind('UploadComplete', function (up, file, info) {
              $log.debug('UploadComplete', info);
              if(isClear && !isError){
                console.log(results);
                scope.uploadItem({data: {"status":"0", "data": results, type: uploadType}});
                childScope.close();
              }
              start.addClass('upload-disabled');
              scope.$apply();
            });
            upload.bind('Error', function (up, err) {
              console.log('Error', err);
              console.log('Error', err.message);
              if(err.code == -600){
                childScope.danger = "文件超过"+config.fileSizeLimit+"，请重新选择上传";
              }
              if(err.status == 403){
                childScope.danger = "上传过期，请从新选择文件上传";
                $timeout(function () {
                  childScope.close();
                }, 3000);
              }
              scope.$apply();
            })
          },1);

          childScope.remove = function (item) {
            upload.removeFile(item.id);
            _.remove(childScope.items, {id: item.id});
          };


          /*childScope.confirm = function () {
            scope.uploadItem({data: {"status":"0", "data": results, type: uploadType}});
          };*/

        }

        function setUploadParam(up, id){
          var new_multipart_params = {
            'uid': id,
            'key': getUploadParam.dir + config.uid,
            'expire': getUploadParam.expire,
            'policy': getUploadParam.policy,
            'OSSAccessKeyId': getUploadParam.accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'signature': getUploadParam.signature
          };
          up.setOption({
            'url': getUploadParam.host,
            'multipart_params': new_multipart_params
          });
          up.start();
        }

        function postInit(){

        }
        function getAccess(dir, url){
          $http({
            method : 'post',
            url : url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
              "key": dir
            }
          }).then(function (data) {
            getUploadParam = data.data;
            cbDialog.showDialogByUrl("app/components/cbUploadFile/cbUploadFile.html", handler, {
              windowClass: "viewFramework-upload-file-dialog"
            });
            postInit();
          });
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.uploadItem({data: {"status":"-1", "data":"上传文件打开成功"}});
          //
          if(!uploadType){
            throw Error('上传的API类型不存在');
          }
          var dir, url;
          if(API[uploadType].version){
            dir = +(new Date()) + API[uploadType].field;
          }else{
            dir = API[uploadType].field;
          }
          url = URL + API[uploadType].url;
          getAccess(dir, url);
          t.preventDefault();
          t.stopPropagation();

        });
      }
    }
  }

})();



