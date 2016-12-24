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
  function MemberEmployeeListController($timeout, $state, $log, cbAlert, permissions, preferencenav, memberEmployee, memberEmployeeConfig) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = $state.params;
    var total = 0;
    memberEmployee.positions().then(function(results){
      console.log('positions', results);
    });
    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: angular.copy(memberEmployeeConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(memberEmployeeConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $log.debug('updateGridPaginationInfo', page);
        //console.log(page);
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
              getList();
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
        if (data.inservice === '1') {
          cbAlert.confirm("是否关闭允许登录店铺后台", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('enable', {'memberId': data.sguid, 'status': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          //setInservice(data.sguid, 1);
        }
      },
      inserviceItem: function (data) {
        $log.debug('statusItem', data);
        if (data.inservice === '1') {
          cbAlert.confirm("是否关闭在职状态", function (isConfirm) {
            console.log(isConfirm);
            if (isConfirm) {
              setStatus('inservice', {'memberId': data.sguid, 'inservice': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          //setInservice(data.sguid, 1);
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
            guid: item.sguid,
            realname: angular.isUndefined(item.realname) ? "" : item.realname,
            username: item.username
          });
        });
        console.log(items);
        memberEmployee.pwdReset(items).then(function (results) {
          if (results.data.status == 0) {
            getList();
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
          getList();
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
    function getList() {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!currentParams.page) {
        return;
      }
      console.log(currentParams);
      memberEmployee.list(currentParams).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && currentParams.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = result.totalCount;
          vm.gridModel.itemList = filterDate(result.data, result.positions, result.roles);
          vm.gridModel.paginationinfo = {
            page: currentParams.page * 1,
            pageSize: 10,
            total: total
          };
          vm.gridModel.loadingState = false;
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      }, function (data) {
        $log.debug('getListError', data);
      });
    }

    getList();

    /**
     * 格式化 岗位和角色
     */
    function filterDate(list, positions, roles){
      var results = [];
      _.forEach(list, function (item) {
        item.position = getPositions(item.positionid, positions);
        item.roleStore = [];
        item.rolename = getRolename(item.roleStore, roles);
        results.push(item);
      });
      return results;
    }

    function getPositions(id, list){
      if(angular.isUndefined(id) || angular.isUndefined(list)){
        return "";
      }
      var item =  _.find(list, function(item){
        return item.sguid == id;
      });
      return angular.isObject(item) ? item.posname : "";
    }

    function getRolename(roles, list){
      if(angular.isUndefined(roles) || angular.isUndefined(list)){
        return "";
      }
      var results = [];
      _.forEach(roles, function (role) {
        var items =  _.find(list, function(item){
          return item.sguid == role.id;
        });
        angular.isObject(items) && results.push(items.rolename);
      });

      return results.join(" ");
    }

  }


  /** @ngInject */
  function MemberEmployeeChangeController($state, $scope, dateFilter, cbAlert, configuration, memberEmployee, systemRole) {
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
    systemRole.all().then(function(results){
      console.log('systemRole', results);
    });
    vm.dataBase = {
      position: {
        posname: "新家的"
      }
    };
    vm.dateOptions1 = {
      startingDay: 1,
      showLunar: true
    };
    vm.dateOptions2 = {
      startingDay: 1
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

    $scope.onboardDateConfig = {
      opened: false,
      minDate: "",
      maxDate: ""
    };
    vm.openedHandler = function () {
      vm.opened = true;
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
    vm.statusItem = function(status, isMobile){
      console.log(status, isMobile);
      if(angular.isUndefined(status) || status === '0'){
        if(isMobile){
          cbAlert.alert("请先填写员工手机号");
        }else{
          vm.dataBase.status = '1';
        }
      }else{
        cbAlert.confirm("是否关闭允许登录店铺后台", function (isConfirm) {
          if (isConfirm) {
            vm.dataBase.status = '0';
          }
          cbAlert.close();
        }, '关闭以后不允许登录店铺后台，您确定？', 'warning');
      }
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
            cbAlert.error("错误提示", results.data.error);
          }
        });
      }else{
        memberEmployee.add(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", results.data.error);
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

