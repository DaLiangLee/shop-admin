/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('MemberEmployeeListController', MemberEmployeeListController)
    .controller('MemberEmployeeChangeController', MemberEmployeeChangeController);

  /** @ngInject */
  function MemberEmployeeListController($timeout, $state, $log, cbAlert, permissions, memberEmployee, memberEmployeeConfig) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 10});
    var total = 0;
    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: angular.copy(memberEmployeeConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(memberEmployeeConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      requestParams: {
        params: currentParams,
        request: "member,employee,export",
        permission: "chebian:store:member:employee:export"
      },
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };

    /**
     * 组件数据交互(子指令和控制交互)
     * removeItem    删除项   批量操作
     * statusItem    修改状态 单个操作
     * resetItem     重置密码 批量操作
     */
    vm.gridModel.config.propsParams = {
      removeItem: function (data) {
        console.log('removeItem', data);
        if (data.status == 0) {
          memberEmployee.remove(data.transmit).then(function (results) {
            if (results.data.status == 0) {
              cbAlert.tips("删除成功");
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", results.data.rtnInfo);
            }
          }, function (data) {
            $log.debug('removeItemError', data);
          });
        }
      },
      statusItem: function (data) {
        $log.debug('statusItem', data);
        if (data.status === '1') {
          cbAlert.confirm("是否关闭允许登录店铺后台", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('enable', {'memberId': data.guid, 'status': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          cbAlert.confirm("是否允许该员工登录店铺后台", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('enable', {'memberId': data.guid, 'status': '1'});
            }
            cbAlert.close();
          }, '开启以后就可以登录后台，是否继续？', 'warning');
        }
      },
      inserviceItem: function (data) {
        $log.debug('inserviceItem', data);
        if (data.inservice === '1') {
          cbAlert.confirm("是否关闭在职状态", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('inservice', {'memberId': data.guid, 'inservice': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          cbAlert.confirm("是否开启在职状态", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('inservice', {'memberId': data.guid, 'inservice': '1'});
            }
            cbAlert.close();
          }, '', 'warning');
        }
      },
      resetItem: function () {
        // 过滤已选中的
        var filters = _.filter(vm.gridModel.itemList, function (item) {
          return item.selected;
        });
        // 如果返回的是空，表示一个没有选中，不用让它继续，防止空提交请求
        if(!filters.length){
          return ;
        }
        var items = [];
        _.forEach(filters, function (item) {
          items.push({
            guid: item.guid,
            realname: angular.isUndefined(item.realname) ? "" : item.realname,
            username: item.username
          });
        });
        console.log(items);
        memberEmployee.pwdReset(items).then(function (results) {
          if (results.data.status == 0) {
            getList(currentParams);
          } else {
            cbAlert.error("错误提示", results.data.rtnInfo);
          }
        }, function (data) {
          $log.debug('removeItemError', data);
        });
      }
    };

    function setStatus(api, data) {
      memberEmployee[api](data).then(function (results) {
        if (results.data.status == 0) {
          cbAlert.tips("修改成功");
          getList(currentParams);
        } else {
          cbAlert.error("错误提示", results.data.rtnInfo);
        }
      }, function (data) {
        $log.debug('getListError', data);
      });
    }


    /**
     * 获取员工列表
     */
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }
      console.log(params);
      memberEmployee.list(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = result.totalCount;
          vm.gridModel.itemList = [];
          angular.forEach(result.data, function (item) {
            if(item.onboarddate && item.onboarddate.indexOf("-") > -1){
              item.onboarddate.replace(/\-/gi, "/");
            }
            item.onboarddate && (item.onboarddate = new Date(item.onboarddate));

            vm.gridModel.itemList.push(item);
          });
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: total
          };
          vm.gridModel.loadingState = false;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);
    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      'handler': function (data) {
        var search = angular.extend({}, currentParams, data);
        $state.go(currentStateName, search);
      }
    };
    memberEmployee.all().then(function (results) {
      var result = results.data;
      if (result.status == 0) {
        console.log(result.data);
        vm.searchModel.config = {
          keyword: currentParams.keyword,
          placeholder: "请输入员工姓名、账号、手机、岗位",
          searchDirective: [
            {
              label: "状态",
              all: true,
              list: [
                {
                  id: 1,
                  label: "在职"
                },
                {
                  id: 0,
                  label: "离职"
                }
              ],
              type: "list",
              name: "inService",
              model: currentParams.inService
            },
            {
              label: "入职时间",
              name: "Date",
              all: true,
              custom: true,
              type: "date",
              start: {
                name: "startDate",
                model: currentParams.startDate,
                config: {
                  placeholder: "起始时间",
                  minDate: new Date("1950/01/01 00:00:00"),
                  maxDate: new Date()
                }
              },
              end: {
                name: "endDate",
                model: currentParams.endDate,
                config: {
                  placeholder: "截止时间",
                  minDate: new Date("1950/01/01 00:00:00"),
                  maxDate: new Date()
                }
              }
            },
            {
              label: "权限名称",
              all: true,
              type: "list",
              name: "role",
              model: currentParams.role,
              list: getRoleList(result.data)
            }
          ]
        }
      } else {
        cbAlert.error("错误提示", result.data);
      }
    });
    /**
     * 格式化权限数据
     * @param arr
     * @returns {Array}
     */
    function getRoleList(arr){
      var results = [];
      angular.forEach(arr, function (item) {
        results.push({
          id: item.id,
          label: item.rolename
        })
      });
      return results;
    }
  }


  /** @ngInject */
  function MemberEmployeeChangeController($state, $scope, dateFilter, cbAlert, configuration, memberEmployee, memberRole) {
    var vm = this;
    //  是否是编辑
    var currentParams = $state.params;
    vm.isChange = !_.isEmpty(currentParams);
    vm.title = $state.current.title;
    console.log(configuration.getConfig());

    vm.storecode = configuration.getConfig().storecode;
    var positions = [];
    memberEmployee.positions().then(function(results){
      console.log('positions', results);
      if(results.data.status == 0){
        positions = results.data.data.concat([]);
      }
    });


    /**
     * 角色名称
     * @type {{}}
     */
    vm.selectModel = {};
    memberEmployee.all().then(function(results){
      console.log('systemRole', results);
      if (results.data.status == 0) {
        vm.selectModel.store = results.data.data;
      } else {
        cbAlert.error("错误提示", results.data.error);
      }
    });



    vm.dataBase = {
      position: {
        posname: "新家的"
      },
      status: "1"
    };
    vm.date1 = {
      options: {
        startingDay: 1,
        showLunar: true,
        placeholder: "请选择员工生日",
        minDate: new Date("1950/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function(){
        vm.date2.opened = false;
      }
    };
    vm.date2 = {
      options: {
        startingDay: 1,
        placeholder: "请选择员工入职时间",
        minDate: new Date("1950/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function(){
        vm.date1.opened = false;
      }
    };
    /*
     * 身份证获取规则
     * 15   AA BB CC DD EE FF GG H
     * 18   AA BB CC DDDD EE FF GG H I
     *
     *     A 省
     *     B 市
     *     C 区
     *     D 年
     *     E 月
     *     F 日
     *     G 顺序号
     *     H 性别（0为女）偶数为女，奇数为男
     *     I 未知
     * */

    /**
     * 获取身份证信息
     * @param code
     * @returns {{region: string, birthday: string, gender: string}}
     * region      发证地区  省市区
     * birthday    生日  yyyy-mm-dd
     * gender      性别，0：女，1：男
     */
    function getIDCardInfo(code) {
      var region, birthday, gender;
      // 15位
      console.log(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(code));

      if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(code)) {
        region = getIDCardRegion(code);
        birthday = getIDCardBirthday("19"+code.substring(6,12));
        gender = getIDCardGender(code.charAt(14));
      }
      // 18位
      if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/.test(code)) {
        region = getIDCardRegion(code);
        birthday = getIDCardBirthday(code.substring(6,14));
        gender = getIDCardGender(code.charAt(16));
      }
      return {
        region: region,
        birthday: birthday,
        gender: gender
      }
    }

    /**
     * 获取发证地区
     * @param code
     * @returns {string}   省市区
     */
    function getIDCardRegion(code){
      return code;
    }
    /**
     * 生日
     * @param code
     * @returns {string}  yyyy-mm-dd
     */
    function getIDCardBirthday(code){
      return code.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    }

    /**
     * 性别
     * @param code
     * @returns {string} 0：女，1：男
     */
    function getIDCardGender(code){
      return code%2+"";
    }

    vm.setGenderAndBirthday = function(code){
      var info = getIDCardInfo(code);
      if(info.birthday && !vm.dataBase.birthday){
        info.birthday.replace(/\-/, '/');
        vm.dataBase.birthday = new Date(info.birthday+' 00:00:00');
      }
      if(info.gender && !vm.dataBase.gender){
        vm.dataBase.gender = info.gender;
      }
    };



    vm.isLoadData = false;
    if (vm.isChange) {
      memberEmployee.get({memberId:currentParams.id}).then(function(results){
        if (results.data.status == 0) {
          setDataBase(results.data.data);
          vm.isLoadData = true;
        } else {
          cbAlert.error("错误提示", results.data.error);
        }
      });
    } else {
      vm.isLoadData = true;
    }

    /**
     * 开启关闭登录
     * 1，需要验证手机号有没有填，如果没有就报错提示
     * 2，关闭时候需要提示，如果是修改时候，就需要提交api来
     */
    vm.statusItem = function(status){
      var title = vm.dataBase.status === "1" ? "是否关闭允许登录店铺后台" : "是否开启允许登录店铺后台";
      var message = vm.dataBase.status === "1" ? "关闭以后不允许登录店铺后台，您确定？" : "开启以后就允许登录店铺后台，您确定？";
      cbAlert.confirm(title, function (isConfirm) {
        if (isConfirm) {
          vm.dataBase.status = vm.dataBase.status === "1" ? "0" : "1";
        }
        cbAlert.close();
      }, message, 'warning');
    };

    function setDataBase(data) {
      console.log('setDataBase',data);
      vm.dataBase = angular.copy(data);
    }

    /**
     * 获取提交数据
     * @param data
     */
    function getDataBase(data){
      var base = angular.extend({}, data);
      base.birthday = getSubmitTime(base.birthday);
      base.onboarddate = getSubmitTime(base.onboarddate);
      _.map(base.roleStore, function(item){
        return {"id": item};
      });
      var roleStore = [];
      angular.forEach(base.roleStore, function(item){
        if(angular.isString(item)){
          roleStore.push({"id": item});
        }else{
          roleStore.push(item);
        }
      });
      base.roleStore = roleStore;
      return base;
    }
    function getSubmitTime(time){
      if(angular.isUndefined(time) || !time){
        return "";
      }
      if(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(time)){
        return dateFilter(new Date(time), 'yyyy-MM-dd HH:mm:ss');
      }
      time.replace(/\-/, '/');
      return dateFilter(new Date(time+" 00:00:00"), 'yyyy-MM-dd HH:mm:ss');
    }

    vm.submit = function () {
      console.log(getDataBase(vm.dataBase));
      if(vm.isChange){
        memberEmployee.update(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", results.data.data);
          }
        });
      }else{
        memberEmployee.add(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", results.data.data);
          }
        });
      }
    };
    function goto() {
      //preferencenav.removePreference($state.current);
      $state.go('member.employee.list', {'page': 1});
    }

  }
})();

