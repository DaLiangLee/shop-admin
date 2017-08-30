/**
 * Created by Administrator on 2017/6/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .filter("stateFilter", stateFilter)
    .filter("weekFilter", weekFilter);

  function stateFilter() {
    return function (input, flag) {
      if (flag === "scopeType") {
        if (!input) {
          return "全场通用";
        } else {
          return "指定消费";
        }
      } else if (flag === "threshold") {
        if (!input) {
          return 0;
        } else {
          return input
        }
      } else if (flag === "num") {
        if (!input) {
          return 0;
        } else {
          return input;
        }
      } else if (flag === "allnum") {
        if (input == 0) {
          return "无限量";
        } else {
          return input;
        }
      } else if (flag === "pernum") {
        if (!input) {
          return "无限制";
        } else {
          return "每人限领" + input + "张";
        }
      }

    }
  }

  function weekFilter() {
    return function (input) {
      var temp = [];
      var flag = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      _.forEach(input, function (v) {
        temp.push(flag[v * 1]);
      });
      return temp.join("、");

    }
  }
})();