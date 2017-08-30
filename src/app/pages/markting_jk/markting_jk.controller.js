/**
 * Created by Administrator on 2017/6/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('MarktingJkListController', MarktingJkListController)
    .controller('addNewJkController', addNewJk);

  function MarktingJkListController($state, cbAlert, marktingJk, marktingJkConfig, computeService) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 10});
    var propsParams = {
      statusItem: function (item) {  // cb-switch
        var tips = item.status == '0' ? '确定开启积客券？' : '确定关闭积客券？';
        cbAlert.ajax(tips, function (isConform) {
          if (isConform) {
            var items = {};
            items.status = item.status == '0' ? 1 : 0;
            items.id = item.id;
            marktingJk.changeStatus(items).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('修改成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, '', 'confirm');
      },
      editorhandler: function (data, item, type, productid) {
        /**
         * 如果没有修改就不要提交给后台了
         */
        if (data == item.num) {
          cbAlert.tips('修改成功');
          return;
        }

        /**
         * 修改值不能比后台传过来的值要大
         */
        if (data*1 < item.num*1) {
          cbAlert.alert('修改的发行数量不能比当前发行数量小');
          return;
        }
        marktingJk.updatanum({id:item.id,num:data}).then(function (results) {
          if (results.data.status === 0) {
            cbAlert.tips('修改成功');
            getList(currentParams);
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }
    };

    vm.gridModel = {
      columns: _.clone(marktingJkConfig().DEFAULT_GRID.columns),
      userPackage: [],
      config: _.merge(marktingJkConfig().DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      sortChanged: function (data) {
        var orders = [];
        angular.forEach(data.data, function (item, key) {
          orders.push({
            "field": key.replace("", ""),
            "direction": item
          });
        });
        var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
        getList(order);
      }
    };

    var DEFAULT_SEARCH = _.cloneDeep(marktingJkConfig().DEFAULT_SEARCH);
    var searchModel = _.chain(_.clone(currentParams)).tap(function (value) {
      _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd','price0','price1']), function (item, key) {
        !_.isUndefined(item) && (value[key] = computeService.pullMoney(item));
      });
    }).value();

    vm.searchModel = {
      config: DEFAULT_SEARCH.config(searchModel),
      'handler': function (data) {
        var items = _.find(DEFAULT_SEARCH.conditionPrice, function (item) {
          return item.id === data.conditionPriceStart * 1;
        });
        if (angular.isDefined(items)) {
          data.conditionPriceEnd = undefined;
        }
        var search = _.chain(data).tap(function (value) {
          _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd','price0','price1']), function (item, key) {
            !_.isUndefined(item) && (value[key] = computeService.pushMoney(item));
          });
        }).value();

        _.chain(currentParams).tap(function (value) {
          _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd','price0','price1']), function (item, key) {
            !_.isUndefined(item) && (value[key] *= 1);

          });
        }).value();
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, search)) {
          $state.reload();
        } else {
          search.page = '1';
          $state.go(currentStateName, search);
        }
      }
    };

    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }

      marktingJk.list(params).then(function (results) {
        var result = results.data;
        if (result.status * 1 === 0) {
          _.forEach(result.data, function (v) {
            if (v.status == 1) {
              v.status = true;
            } else {
              v.status = false;
            }
          });
          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          vm.gridModel.config.propsParams.message = result.message;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);

  }

  function addNewJk($state,$scope,cbAlert, marktingJk, copyAndCreat,marktingJkConfig, computeService, utils, $window, shophomeService) {
    var vm = this;
    vm.formConfig={
      dataPick:{minDate: new Date()},
      isStartOpen: false,
      isEndOpen: false,
      weeks2:_.map('一二三四五六日',function(item, index){
        return {
          flag: false,
          index: index,
          text: "周"+item
        };
      }),
      pushDays: function () {
        vm.formData.availableInWeek = _.map(_.filter(this.weeks2, function (item) {
          return item.flag;
        }), function (item) {
          return item.index;
        });
      }
    };

    vm.formData = {
      // "availableDays": "",
      "canMix": false,
      // "conditionPrice": "",
      // "end": "",
      // "start": "",
      // "name": "",
      "num": "",
      "numPerUser": 1,
      // "price": "",
      "scopeType": 0,
      "status": 1,
      // "itemScope": "",
      // "instruction": "",
      "availableInWeek": [0, 1, 2, 3, 4, 5, 6],
      "dateOrtime": true
    };


    function setWeeks2() {
      _.forEach(vm.formConfig.weeks2, function (item) {
        _.forEach(vm.formData.availableInWeek, function (newItem) {
          if(item.index*1 === newItem*1){
            item.flag = true;
            return false;
          }
        });
      });
    }

    if(copyAndCreat.getData().name){
      vm.formData = copyAndCreat.getData();
    }
    setWeeks2();
    shophomeService.getInfo().then(function(results) {
      vm.config = {
        isLegal: false,
        storeName:results.data.store.storename,
        storeAddress:results.data.store.address,
        storeTel:results.data.store.telephone
      };
    });

    vm.formHandler = {

      /**
       * 单选按钮互斥数据初始化
       * @param type
       */
      toggleType: function () {
        vm.formData.start = undefined;
        vm.formData.end = undefined;
        vm.formData.availableDays = '';
      },

      /**
       * 新增积客券按钮功能
       */
      addJk: function () {
        sendData(vm.formData);
      },

      /**
       * 数据初始化
       * @param data
       */
      inputReset: function (data) {
        vm.formData[data] = "";
      }

      /**
       * 使用门槛与券面值验证方法
       */

      /*invalite: function () {
        if (vm.formData.jkPrice * 1 >= vm.formData.jkThreshold * 1) {
          vm.formData.isLegal = false;
          console.log('验证不通过');
        }else {
          vm.formData.isLegal = true;
        }
      }*/
    };
    vm.propsProgram = {
      /*productHandler: function (data) {
       if (data.status === "0") {
       vm.formData.jkProductScope = _.map(data.data, function (v) {
       return {productname: v.itemname};
       });
       }
       },
       serviceHandler: function (data) {
       if (data.status === "0") {
       vm.formData.jkServiceScope = _.map(data.data, function (v) {
       return {manualskuvalues: v.itemname};
       });
       }
       }*/
    };


    /**
     * 判断sessionStorage中是否有缓存，有缓存则vm.formData使用本地缓存
     */

    // var localData = angular.fromJson($window.sessionStorage.getItem("newJkData"));
    // if (localData) {
    //   vm.formData = localData;
    // }


    function getData(params){
      var queryParams = _.assign({},params);
      queryParams.conditionPrice = computeService.pushMoney(queryParams.conditionPrice);
      queryParams.price = computeService.pushMoney(queryParams.price);
      queryParams.availableInWeek = angular.toJson(queryParams.availableInWeek);
      if(queryParams.scopeType == 0) {
        queryParams = _.omit(queryParams,queryParams,"itemScope");
      }
      return queryParams;
    }

    function sendData(params, callback) {
      marktingJk.add(getData(vm.formData)).then(function (results) {
        var result = results.data;
        if (result.status * 1 === 0) {
          cbAlert.tips("添加成功", result.data);

          /**
           * 重置数据
           */
          // vm.formData = DEFAULT_FORM_DATA;
          // $window.sessionStorage.removeItem("newJkData");
          copyAndCreat.removeData();
          callback && callback();
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }




    /**
     * 返回列表页
     */
    function goto() {
      $state.go('markting.jk.list', {'page': 1});
    }

    /**
     * 保存并返回
     */
    vm.submitBack = function () {
      sendData(vm.formData, function () {
        cbAlert.close();
        goto()
      })
    };

    $scope.$on("$destroy", function() {
      copyAndCreat.removeData();
    })
  }
})();


