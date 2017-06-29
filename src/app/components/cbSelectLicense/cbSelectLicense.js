/**
 * Created by Administrator on 2016/11/30.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbSelectLicense', cbSelectLicense)
    .directive('cbInputLicense', cbInputLicense);
  /**
   * data         获取交互数据
   * config       配置信息
   * selectItem   返回数据
   */
  /** @ngInject */
  function cbSelectLicense() {
    var loadData = {
      "status": 0,
      "data": [{
        "areaname": "北京市",
        "areatype": "1",
        "id": 110000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "京:A,B,C,E,F,G,O"
      }, {
        "areaname": "天津市",
        "areatype": "1",
        "id": 120000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "津:A,B,C,E"
      }, {
        "areaname": "河北省",
        "areatype": "1",
        "id": 130000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "冀:A,B,C,D,E,F,G,H,J,R,T"
      }, {
        "areaname": "山西省",
        "areatype": "1",
        "id": 140000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "晋:A,B,C,D,E,F,K,M,H,L,J"
      }, {
        "areaname": "内蒙古自治区",
        "areatype": "1",
        "id": 150000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "蒙:A,B,C,D,G,K,E,L,J,F,H,M"
      }, {
        "areaname": "辽宁省",
        "areatype": "1",
        "id": 210000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "辽:A,B,C,D,E,F,G,H,J,K,L,M,N,P"
      }, {
        "areaname": "吉林省",
        "areatype": "1",
        "id": 220000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "吉:A,B,C,D,E,F,J,G,H"
      }, {
        "areaname": "黑龙江省",
        "areatype": "1",
        "id": 230000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "黑:A,B,G,H,J,E,F,D,K,C,N,M,P"
      }, {
        "areaname": "上海市",
        "areatype": "1",
        "id": 310000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "沪:A,B,C,D,R"
      }, {
        "areaname": "江苏省",
        "areatype": "1",
        "id": 320000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "苏:A,B,C,D,E,F,G,H,J,K,L,M,N"
      }, {
        "areaname": "浙江省",
        "areatype": "1",
        "id": 330000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "浙:A,B,C,D,E,F,G,H,J,K,L"
      }, {
        "areaname": "安徽省",
        "areatype": "1",
        "id": 340000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "皖:A,B,C,D,E,F,G,H,J,K,L,M,N,P,R,S"
      }, {
        "areaname": "福建省",
        "areatype": "1",
        "id": 350000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "闽:A,B,C,D,E,F,G,H,J"
      }, {
        "areaname": "江西省",
        "areatype": "1",
        "id": 360000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "赣:A,B,C,D,E,F,G,H,J,K,L"
      }, {
        "areaname": "山东省",
        "areatype": "1",
        "id": 370000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "鲁:A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S"
      }, {
        "areaname": "河南省",
        "areatype": "1",
        "id": 410000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "豫:A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,U"
      }, {
        "areaname": "湖北省",
        "areatype": "1",
        "id": 420000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "鄂:A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S"
      }, {
        "areaname": "湖南省",
        "areatype": "1",
        "id": 430000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "湘:A,B,C,D,E,F,G,H,J,K,L,M,N,U"
      }, {
        "areaname": "广东省",
        "areatype": "1",
        "id": 440000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "粤:A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W"
      }, {
        "areaname": "广西壮族自治区",
        "areatype": "1",
        "id": 450000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "桂:A,B,C,D,E,F,G,J,K,L,M,N,P,R"
      }, {
        "areaname": "海南省",
        "areatype": "1",
        "id": 460000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "琼:A,B,C,D"
      }, {
        "areaname": "重庆市",
        "areatype": "1",
        "id": 500000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "渝:A,B,C,F,G,H"
      }, {
        "areaname": "四川省",
        "areatype": "1",
        "id": 510000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "川:A,B,C,D,E,F,H,J,K,L,Q,R,S,T,U,V,W,X,Y,Z"
      }, {
        "areaname": "贵州省",
        "areatype": "1",
        "id": 520000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "贵:A,B,C,D,E,F,G,H,J"
      }, {
        "areaname": "云南省",
        "areatype": "1",
        "id": 530000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "云:A,C,D,E,F,G,H,J,L,K,M,N,P,Q,R,S"
      }, {
        "areaname": "西藏自治区",
        "areatype": "1",
        "id": 540000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "藏:A,B,C,D,E,F,G"
      }, {
        "areaname": "陕西省",
        "areatype": "1",
        "id": 610000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "陕:A,B,C,D,E,F,G,H,J,K"
      }, {
        "areaname": "甘肃省",
        "areatype": "1",
        "id": 620000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "甘:A,B,C,D,E,F,G,H,J,K,L,M,N,P"
      }, {
        "areaname": "青海省",
        "areatype": "1",
        "id": 630000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "青:A,B,C,D,E,F,G,H"
      }, {
        "areaname": "宁夏回族自治区",
        "areatype": "1",
        "id": 640000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "宁:A,B,C,D,E"
      }, {
        "areaname": "新疆维吾尔自治区",
        "areatype": "1",
        "id": 650000,
        "parentid": 86,
        "parentids": "0,86",
        "prefix": "新:A,B,C,D,E,G,H,J,K,L,M,N,P,Q,R"
      }, {
        "areaname": "台湾省",
        "areatype": "1",
        "id": 710000,
        "parentid": 86,
        "parentids": "0,86"
      }, {
        "areaname": "香港特别行政区",
        "areatype": "1",
        "id": 810000,
        "parentid": 86,
        "parentids": "0,86"
      }, {"areaname": "澳门特别行政区", "areatype": "1", "id": 820000, "parentid": 86, "parentids": "0,86"}]
    };
    var formatData = function (data) {
      var results = [];

      function getName(item) {
        return item.prefix.split(":")[0];
      }

      function getItms(item) {
        var arr = [];
        var json = item.prefix.split(":")[1];
        angular.forEach(json.split(","), function (key, index) {
          arr.push({
            id: item.id + "" + index,
            name: key
          });
        });
        return arr;
      }

      angular.forEach(data, function (item) {
        if (angular.isDefined(item.prefix)) {
          results.push({
            id: item.id,
            name: getName(item),
            items: getItms(item)
          });
        }
      });
      return results;
    };
    return {
      restrict: "A",
      scope: {
        select: "=",
        updateLicence: "&"
      },
      templateUrl: "app/components/cbSelectLicense/cbSelectLicense.html",
      link: function (scope) {
        var dataLists = formatData(loadData.data);
        scope.selectModel2 = {
          store: dataLists[0].items,
          handler: function (data) {
            if (scope.selectModel3.text) {
              scope.select = scope.selectModel1.select + data + " " + scope.selectModel3.text;
              scope.updateLicence({data: scope.select});
            }
          }
        };
        scope.selectModel1 = {
          store: dataLists,
          handler: function (data) {
            scope.selectModel2.store = _.find(dataLists, {'name': data}).items;
            scope.selectModel2.select = scope.selectModel2.store[0].name;
            if (scope.selectModel3.text) {
              scope.select = data + scope.selectModel2.select + " " + scope.selectModel3.text;
              scope.updateLicence({data: scope.select});
            }
          }
        };
        scope.selectModel3 = {
          handler: function () {
            if (scope.selectModel3.text) {
              scope.select = scope.selectModel1.select + scope.selectModel2.select + " " + scope.selectModel3.text;
              scope.updateLicence({data: scope.select});
            }
          }
        };
        var select = scope.$watch('select', function (value) {
          if (angular.isDefined(value)) {
            scope.selectModel1.select = value.charAt(0);
            scope.selectModel2.select = value.charAt(1);
            scope.selectModel2.store = _.find(dataLists, {'name': value.charAt(0)}).items;
            if (/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}\s[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(value)) {
              scope.selectModel3.text = value.substring(3);
            } else {
              scope.selectModel3.text = value.substring(2);
            }
          } else {
            scope.selectModel1.select = dataLists[0].name;
            scope.selectModel2.select = dataLists[0].items[0].name;
            scope.selectModel3.text = "";
          }
        });

        /**
         * 销毁操作
         */
        scope.$on('$destroy', function () {
          select();
        });
      }
    }
  }

  /** @ngInject */
  function cbInputLicense() {
    var LICENSE_REGULAR = /^[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    return {
      restrict: 'A', // 作为元素属性
      require: "?ngModel",  // 获取ngModelController
      scope: {}, // 这个指令有一个独立的作用域对象，也就是有一个独立的scope对象
      link: function (scope, iElement, iAttrs, ngModelCtrl) {
        var required = iAttrs.cbInputLicense === 'required';
        var parents = iElement.parent();
        var errorClass = iAttrs.cbInputLicense;
        // 如果没有ng-model则什么都不做
        if (!ngModelCtrl) {
          return;
        }
        // 输入错误
        var isError = false;
        // $parsers接受一个数组，用于将viewValue转化成modelValue
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (angular.isUndefined(viewValue)) {
            return "";
          }
          var value;
          if (angular.isString(viewValue)) {
            value = viewValue.substring(0, 5);
            var valueStart = value.substring(0, 4).replace(/[^A-Za-z0-9]/g, "");
            var valueEnd = value.substring(4).replace(/[^A-Za-z0-9挂学警港澳]/g, "");
            value = valueStart.toLocaleUpperCase() + valueEnd.toLocaleUpperCase();
            if(value.length === 5 && required){
              iElement.blur();
            }
            if (value != viewValue) {
              ngModelCtrl.$setViewValue(value);
              ngModelCtrl.$render();
            }
          }
          if(!required){
            ngModelCtrl.$setValidity("cbInputLicense", true);
            return value;
          }
          if (LICENSE_REGULAR.test(value) && required) {
            ngModelCtrl.$setValidity("cbInputLicense", true);
            parents.removeClass(errorClass);
            isError = false;
            return value;
          } else {
            ngModelCtrl.$setValidity("cbInputLicense", false);
            isError = true;
            return undefined;
          }
        });

        iElement.on('blur', function(){
          isError && parents.addClass(errorClass);
        });
      }
    }
  }
})();
