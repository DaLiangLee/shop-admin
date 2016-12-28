/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
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
    .directive('shopHomeSettingsHours', shopHomeSettingsHours)
    .directive('shopHomeSettingsMember', shopHomeSettingsMember)
    .directive('shopHomeSettingsTelephone', shopHomeSettingsTelephone);

  /** @ngInject */
  function shopHomeSettingsHours($filter, cbDialog) {
    return {
      restrict: "A",
      scope: {
        startTime: "=",
        endTime: "=",
        settingItem: '&'
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          childScope.hours = {
            start: timeChange(scope.startTime, 0),
            end: timeChange(scope.endTime, 1)
          };
          childScope.hstep = 1;
          childScope.mstep = 5;
          childScope.ismeridian = false;
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            var opentime = $filter('date')(childScope.hours.start, 'HH:mm'),
              closetime = $filter('date')(childScope.hours.end, 'HH:mm');
            if (scope.startTime == opentime && closetime == scope.endTime) {
              scope.settingItem({data: {"status": "1", "data": ""}});
            } else {
              scope.settingItem({
                data: {
                  "status": "0", "data": {
                    opentime: opentime,
                    closetime: closetime
                  }
                }
              });
            }
            childScope.close();
          }
        }

        function format(time, num) {
          if (time % num < num) {
            time = time - time % num + num;
          }
          if (time < 10) {
            time = "0" + time;
          } else {
            time = "" + time;
          }
          return time;
        }

        function timeChange(time, num) {
          var DATE = new Date();
          if (time == '0') {
            time = DATE.getHours() + ":" + DATE.getMinutes();
          }
          if (time.indexOf(":") > -1) {
            if (time.split(":")[0] * 1 + num > 23) {
              time = "00:" + time.split(":")[1];
            } else {
              time = time.split(":")[0] * 1 + num + ":" + format(time.split(":")[1] * 1, 5);
            }
          } else {
            if (time + num > 23) {
              time = "00:00"
            } else {
              time = (time + num) + ":00";
            }
          }
          var date = DATE.getFullYear() + "-" + DATE.getMonth() + "-" + DATE.getDay() + " " + time + ":00:00";
          return (new Date(date)).getTime();
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.settingItem({data: {"status": "-1", "data": "设置营业时间打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/store_shop/shop_home_settings_hours.html", handler, {
            windowClass: "viewFramework-shop-home-settings-hours-dialog"
          });
        });
      }
    }
  }

  /** @ngInject */
  function shopHomeSettingsTelephone(cbDialog) {
    return {
      restrict: "A",
      scope: {
        telephone: "=",
        settingItem: '&'
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          childScope.telephone = angular.copy(scope.telephone);
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            if (scope.telephone == childScope.telephone) {
              scope.settingItem({data: {"status": "1", "data": ""}});
            } else {
              scope.settingItem({data: {"status": "0", "data": childScope.telephone}});
            }
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.settingItem({data: {"status": "-1", "data": "设置客服电话打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/store_shop/shop_home_settings_telephone.html", handler, {
            windowClass: "viewFramework-shop-home-settings-telephone-dialog"
          });
        });
      }
    }
  }

  /** @ngInject */
  function shopHomeSettingsMember(cbDialog, memberEmployee, cbAlert) {
    return {
      restrict: "A",
      scope: {
        member: "=",
        settingItem: '&'
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          childScope.telephone = angular.copy(scope.telephone);
          var currentParams = {
            page: 1,
            pageSize: 5
          };
          childScope.gridModel = {
            "columns": [
              {
                "id": 0,
                "name": "序号",
                "none": true
              },
              {
                "id": 1,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.worknum"></span>',
                "name": '工号',
                "width": 150
              },
              {
                "id": 2,
                "cssProperty": "state-column",
                "fieldDirective": '<a class="state-unread" bo-text="item.realname" ui-sref="member.employee.edit({id: item.sguid})"></a>',
                "name": '姓名',
                "width": 150
              },
              {
                "id": 5,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.position"></span>',
                "name": '岗位'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>',
                "name": '手机号',
                "width": 100
              },
              {
                "id": 6,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.description"></span>',
                "name": '员工简介'
              },
              {
                "id": 8,
                "cssProperty": "state-column",
                "fieldDirective": '<div cb-switch checked="item.inservice" ng-click="propsParams.inserviceItem(item)"></div>',
                "name": '状态',
                "width": 80
              }
            ],
            "config": {
              'settingColumnsSupport': false,   // 设置表格列表项
              'checkboxSupport': true,  // 是否有复选框
              'sortSupport': true,
              'paginationSupport': true,  // 是否有分页
              'selectedProperty': "selected",  // 数据列表项复选框
              'selectedScopeProperty': "selectedItems",
              'useBindOnce': true,  // 是否单向绑定
              "paginationInfo": {   // 分页配置信息
                maxSize: 5,
                showPageGoto: true
              },
              'addColumnsBarDirective': []
            },
            itemList: [],
            loadingState: true,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              var page = angular.extend({}, currentParams, {page: data});
              getList(page);
            }
          };


          /**
           * 获取员工列表
           */
          function getList(params) {
            memberEmployee.list(params).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
                childScope.gridModel.itemList = filterDate(result.data, result.positions);
                childScope.gridModel.paginationinfo = {
                  page: params.page * 1,
                  pageSize: 5,
                  total: result.totalCount
                };

                childScope.gridModel.loadingState = false;
              } else {
                cbAlert.error("错误提示", result.rtnInfo);
              }
            }, function (data) {
              $log.debug('getListError', data);
            });
          }

          getList(currentParams);


          /**
           * 格式化 岗位
           */
          function filterDate(list, positions) {
            var results = [];
            _.forEach(list, function (item) {
              item.selected = item.isshow === '1';
              item.position = getPositions(item.positionid, positions);
              results.push(item);
            });
            return results;
          }


          function getPositions(id, list) {
            if (angular.isUndefined(id) || angular.isUndefined(list)) {
              return "";
            }
            var item = _.find(list, function (item) {
              return item.sguid == id;
            });
            return angular.isObject(item) ? item.posname : "";
          }


          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };

          /**
           * ,show为展示的员工guid数组, hide为从展示改为不展示的员工guid数组
           * @returns {{show: Array, hide: Array}}
           */
          function getSubmitData(list){
            var show = _.filter(list, function (item) {
              return item.selected;
            });
            var hide = _.filter(list, function (item) {
              return !item.selected && item.isshow === '1';
            });
            return {
              show: getGuid(show),
              hide: getGuid(hide)
            }
          }
          function getGuid(array) {
            if(!array.length){
              return [];
            }
            var results = [];
            _.forEach(array, function (item) {
              results.push(item.guid);
            });
            return results;
          }

          
          childScope.interceptorConfirm = function () {
            memberEmployee.changeshow(getSubmitData(childScope.gridModel.itemList)).then(function (results) {
              console.log(results);
              
            });
            if (scope.telephone == childScope.telephone) {
              scope.settingItem({data: {"status": "1", "data": ""}});
            } else {
              scope.settingItem({data: {"status": "0", "data": childScope.telephone}});
            }
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.settingItem({data: {"status": "-1", "data": "设置服务人员打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/store_shop/shop-home-settings-member.html", handler, {
            windowClass: "viewFramework-shop-home-settings-member-dialog"
          });
        });
      }
    }
  }
})();


