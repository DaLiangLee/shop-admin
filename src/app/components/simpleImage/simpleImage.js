/**
 * Created by Administrator on 2017/1/5.
 */
/**
 * simpleImage是一个通用的图片组件上传
 * 包括表格
 * config  全局配置参数     必填
 * searchHandler  事件回调 返回搜索信息 必填
 *
 * config    全局配置参数
 *    width   图片限制宽度
 *    height  图片限制高度
 *    oss
 *        图片处理参数
 *    ?x-oss-process=image/resize,w_300
 *    limit   限制个数
 *  image    接收一个带,号字符串
 *  uploadHandler   回调函数
 */

(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleImage', simpleImage);

  /**
   * 获取图片数组
   * @param image
   * @returns {Array}
   */
  function getImage(image) {
    if (!image) {
      return [];
    }
    var results = [];
    if (image.indexOf(",") > -1) {
      results = image.split(",");
    } else {
      results = [image];
    }
    return results;
  }

  /** @ngInject */
  function simpleImage() {
    return {
      restrict: "A",
      scope: {
        config: "=",
        image: "=",
        uploadHandler: "&",
        deleteHandler:"&"
      },
      templateUrl: "app/components/simpleImage/simpleImage.html",
      link: function (scope) {
        scope.config = angular.extend({
          limit: 1,
          width: 200,
          height: 200,
          oss: "?x-oss-process=image/resize,w_300",
          message: "请选择2M以内的图片",
          uploadtype: "",
          title: ""
        }, scope.config);
        scope.addStyle = {
          width: scope.config.width + "px",
          height: scope.config.height + "px"
        };
        scope.imageArr = [];

        getImage(scope.image).length && angular.forEach(getImage(scope.image), function (item, index) {
          scope.imageArr.push({
            width: scope.config.width,
            height: scope.config.height,
            url: item,
            src: item + scope.config.oss,
            index: index
          });
        });

        scope.remove = function ($event, item) {
          $event.stopPropagation();
          console.log(item);
          scope.deleteHandler({
            data:{
              status:0,
              data:"删除图片"
            }
          });
          _.remove(scope.imageArr, function (key) {
            return key.index === item.index;
          });
        };

        scope.upload = {
          handler: function(data) {
            if(data.status == 0 && data.data.length){
              var index = scope.imageArr.length - 1;
              scope.imageArr.push({
                width: scope.config.width,
                height: scope.config.height,
                url: data.data[0].url,
                src: data.data[0].url + scope.config.oss,
                index: index
              });
              scope.uploadHandler({data: {status: 0, data: scope.imageArr}});
            }
          }
        };
      }
    }
  }
})();
