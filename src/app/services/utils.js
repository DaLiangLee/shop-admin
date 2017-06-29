/**
 * Created by Administrator on 2016/11/24.
 */
(function () {
  'use strict';
  /**
   * observer 观察者
   * @method register    注册
   * @method fire        发布
   * @method remove      取消
   */
  angular
    .module('shopApp')
    .factory('utils', utils);

  /** @ngInject */
  function utils($q, $filter, cbAlert, configuration, webDefaultConfig) {
    return {
      /**
       * 根据start和end获取列表的model
       * @param list        列表
       * @param start       起始
       * @param end         结束
       * @returns {number}  如果找不到返回-1,找到返回正确的索引
       */
      getCustomModel: function (list, start, end) {
        if (_.isUndefined(start) && _.isUndefined(end)) {
          return -1;
        }
        var items;
        end = end || start;
        items = _.filter(list, function (item) {
          return item.start === start && item.end === end;
        });
        return items.length === 1 ? items[0]['id'] : -2;
      },

      /**
       * 根据地址和类型获取图片地址，或者设置默认图片
       * @param src        图片地址
       * @param type       默认图片类型  logo 汽车车标， user 会员头像， product 商品图片 server 服务图片
       * @returns {string}  返回一个正确的地址
       */
      getImageSrc: function (src, type) {
        if (src) {
          return configuration.getStatic() + src;
        }
        if (arguments.length === 1) {
          throw Error('没有传递type或者src');
        }
        var types = webDefaultConfig.WEB_DEFAULT_IMAGE;
        if (_.isUndefined(types[type])) {
          throw Error('默认图片类型错误，请查阅api.js查看webDefaultConfig.WEB_DEFAULT_IMAGE');
        }
        return types[type];
      },
      /**
       * 在数组里面根据value参数获取数组中对应的数据
       * @param arr                数据
       * @param id                 查询id
       * @param value              比较的字段 默认id
       * @returns  undefined或{}   返回找不到或者结果对象
       */
      getData: function (arr, id, value) {
        if (!angular.isArray(arr)) {
          throw Error('需要传递一个数组');
        }
        if (angular.isUndefined(id)) {
          throw Error('需要传递一个查询项的值');
        }
        value = value || 'id';
        return _.find(arr, function (item) {
          return item[value] === id;
        });
      },
      /**
       * 判断是否是数字数字类型，字符串数字都可以
       * @param value
       * @returns {boolean}
       */
      isNumber: function (value) {
        return _.isNaN(value * 1)
      },
      /**
       * 判断是否为空
       * false, true, '', [], {}  ==> true
       * @param value  数据
       * @returns {boolean}
       */
      isEmpty: function (value) {
        return _.isEmpty(value) && !_.isNumber(value);
      },
      /**
       * http 返回状态，如果后台返回状态是0就表示成功如果不是就是失败
       */
      requestHandler: function (results) {
        var deferred = $q.defer();
        if (results.data.status === 0 || results.data.status === "0") {
          deferred.resolve(results.data);
        } else {
          cbAlert.error("错误提示", results.data.data);
          deferred.reject(results.data);
        }
        return deferred.promise;
      },
      /**
       * 获取未来时间
       * @param day  天数 默认 0
       * @param format   格式化形式 默认2017-06-20
       * @return {string}
       */
      getFutureTime: function (day, format) {
        format = format || 'yyyy-MM-dd';
        day = day || 0;
        var daysMs = day * 24 * 3600 * 1000;
        var currentMs = new Date().getTime() + daysMs;
        var theday = new Date();
        theday.setTime(currentMs);
        return $filter('date')(theday, format);
      },
      /**
       * 计算日期差 时间格式  "YYYY-MM-DD"
       * @param createdate 开始时间
       * @param expire 结束时间
       * @return {Number}
       */
      getComputeDay: function (createdate, expire) {
        if (!expire) {
          return null;
        }
        var time1 = new Date(createdate).setHours(0,0,0,0);
        var time2 = new Date(expire).setHours(0,0,0,0);
        var day = (time2 - time1) / (1000 * 60 * 60 * 24);
        if(day < 0){
          return day;
        }
        return day + 1;
      }
    }
  }
})();
