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
  function MemberEmployeeListController($q, $timeout, $state, $log, cbAlert, permissions, memberEmployee, memberEmployeeConfig) {
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
        if (data.status == 0) {
          memberEmployee.remove(data.transmit).then(function (results) {
            if (results.data.status == 0) {
              cbAlert.tips("删除成功");
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
        }
      },
      statusItem: function (data) {
        $log.debug('statusItem', data);
        if (data.status === '1') {
          cbAlert.confirm("是否关闭允许登录店铺后台", function (isConfirm) {
            if (isConfirm) {
              setStatus('enable', {'memberId': data.guid, 'status': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          cbAlert.confirm("是否允许该员工登录店铺后台", function (isConfirm) {
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
            if (isConfirm) {
              setStatus('inservice', {'memberId': data.guid, 'inservice': '0'});
            }
            cbAlert.close();
          }, '关闭以后不允许登录店铺后台', 'warning');
        } else {
          cbAlert.confirm("是否开启在职状态", function (isConfirm) {
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
        if (!filters.length) {
          return;
        }
        var items = [];
        _.forEach(filters, function (item) {
          items.push({
            guid: item.guid,
            realname: angular.isUndefined(item.realname) ? "" : item.realname,
            allusername: item.allusername
          });
        });
        memberEmployee.pwdReset(items).then(function (results) {
          var result = results.data;
          if (result.status == 0) {
            var fail = "", success = "";
            if (result.data.fail.length) {
              fail += "<h4>下列员工已超过当日重置限制（3次）：</h4>";
              _.forEach(result.data.fail, function (item) {
                fail += item + " ";
              });
            }

            if (result.data.success.length) {
              success += "<h4>下列员工密码重置成功：</h4>";
              _.forEach(result.data.success, function (item) {
                success += item + " ";
              });
              success += "<br />";
            }
            cbAlert.dialog({
              title: "提示",
              type: "none",
              text: '<div style="text-align: left;">' + success + fail + '</div>',
              html: true
            });
            getList(currentParams);
          } else {
            cbAlert.error("错误提示", result.data);
          }
        });
      }
    };

    function setStatus(api, data) {
      memberEmployee[api](data).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          cbAlert.tips("修改成功");
          getList(currentParams);
        }
        cbAlert.error("错误提示", result.data);
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
      memberEmployee.list(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = result.totalCount;
          vm.gridModel.itemList = [];
          angular.forEach(result.data, function (item) {
            if (item.onboarddate && item.onboarddate.indexOf("-") > -1) {
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
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, data)) {
          $state.reload();
        } else {
          $state.go(currentStateName, data);
        }
      }
    };
    memberEmployee.all().then(function (results) {
      var result = results.data;
      if (result.status == 0) {
        vm.searchModel.config = {
          other: currentParams,
          keyword: {
            placeholder: "请输入员工姓名、账号、手机、岗位",
            model: currentParams.keyword,
            name: "keyword",
            isShow: true
          },
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
    function getRoleList(arr) {
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
  function MemberEmployeeChangeController($q, $state, dateFilter, cbAlert, configuration, memberEmployee) {
    var vm = this;
    //  是否是编辑
    var currentParams = $state.params;
    vm.isChange = !_.isEmpty(currentParams);
    vm.title = $state.current.title;

    /**
     * 绑定数据
     * @type {{}}
     */
    vm.dataBase = {}

    /**
     * 获取店铺id
     * @type {*}
     */
    vm.storecode = configuration.getConfig().storecode;


    /**
     * 角色名称
     * @type {{}}
     */
    vm.selectModel = {};
    memberEmployee.all().then(function (results) {
      if (results.data.status == 0) {
        vm.selectModel.store = results.data.data;
      } else {
        cbAlert.error("错误提示", results.data.error);
      }
    });

    /**
     * 员工生日配置
     * @type {{options: {startingDay: number, showLunar: boolean, placeholder: string, minDate: Date, maxDate: Date}, opened: boolean, open: MemberEmployeeChangeController.date1.open}}
     */
    vm.date1 = {
      options: {
        startingDay: 1,
        showLunar: true,
        placeholder: "请选择员工生日",
        minDate: new Date("1950/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function () {
        vm.date2.opened = false;
      }
    };
    /**
     * 员工入职配置
     * @type {{options: {startingDay: number, showLunar: boolean, placeholder: string, minDate: Date, maxDate: Date}, opened: boolean, open: MemberEmployeeChangeController.date1.open}}
     */
    vm.date2 = {
      options: {
        startingDay: 1,
        placeholder: "请选择员工入职时间",
        minDate: new Date("1950/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function () {
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
      if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(code)) {
        region = getIDCardRegion(code);
        birthday = getIDCardBirthday("19" + code.substring(6, 12));
        gender = getIDCardGender(code.charAt(14));
      }
      // 18位
      if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/.test(code)) {
        region = getIDCardRegion(code);
        birthday = getIDCardBirthday(code.substring(6, 14));
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
    function getIDCardRegion(code) {
      return code;
    }

    /**
     * 生日
     * @param code
     * @returns {string}  yyyy-mm-dd
     */
    function getIDCardBirthday(code) {
      return code.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    }

    /**
     * 性别
     * @param code
     * @returns {string} 0：女，1：男
     */
    function getIDCardGender(code) {
      return code % 2 + "";
    }


    vm.setGenderAndBirthday = function (code) {
      var info = getIDCardInfo(code);
      if (info.birthday && !vm.dataBase.birthday) {
        info.birthday.replace(/\-/, '/');
        vm.dataBase.birthday = new Date(info.birthday + ' 00:00:00');
      }
      if (info.gender && !vm.dataBase.gender) {
        vm.dataBase.gender = info.gender;
      }
    };


    /**
     * 加载数据
     * @type {boolean}
     */
    vm.isLoadData = false;
    /**
     * 判断当前是否编辑
     */
    if (vm.isChange) {
      $q.all([memberEmployee.get({memberId: currentParams.id}), memberEmployee.positions()]).then(function (results) {
        var member = results[0].data;
        var positions = results[1].data;
        if (member.status == 0 && positions.status == 0) {
          setDataBase(member.data, positions.data);
          vm.position = positions.data;
          vm.isLoadData = true;
        } else {
          if (member.status != 0) {
            cbAlert.error("错误提示", member.data);
          }
          if (positions.status != 0) {
            cbAlert.error("错误提示", positions.data);
          }
        }
      });
    } else {
      memberEmployee.positions().then(function (results) {
        if (results.data.status == 0) {
          vm.position = results.data.data.concat([]);
        } else {
          cbAlert.error("错误提示", results.data.data);
        }
      });
      vm.dataBase.status = "1";
      vm.dataBase.position = {};
      vm.dataBase.position.posname = "";
      vm.isLoadData = true;
    }

    /**
     * 开启关闭登录
     * 1，需要验证手机号有没有填，如果没有就报错提示
     * 2，关闭时候需要提示，如果是修改时候，就需要提交api来
     */
    vm.statusItem = function () {
      var title = vm.dataBase.status === "1" ? "是否关闭允许登录店铺后台" : "是否开启允许登录店铺后台";
      var message = vm.dataBase.status === "1" ? "关闭以后不允许登录店铺后台，您确定？" : "开启以后就允许登录店铺后台，您确定？";
      cbAlert.confirm(title, function (isConfirm) {
        if (isConfirm) {
          vm.dataBase.status = vm.dataBase.status === "1" ? "0" : "1";
        }
        cbAlert.close();
      }, message, 'warning');
    };


    /**
     * 编辑状态 设置当前数据
     * @param data
     */
    function setDataBase(data, positions) {
      vm.dataBase = angular.copy(data);
      vm.dataBase.position = {};
      vm.dataBase.position.posname = getPosname(vm.dataBase.positionid, positions);
    }

    /**
     * 获取岗位名称 显示到页面
     * @param id
     * @param list
     * @returns {*}
     */
    function getPosname(id, list) {
      var items = _.filter(list, function (item) {
        return item.guid == id;
      });
      return items.length === 1 ? items[0].posname : "";
    }

    function getPositionid(posname, list) {
      var items = _.filter(list, function (item) {
        return item.posname == posname;
      });
      return items.length === 1 ? items[0].guid : undefined;
    }

    /**
     * 获取提交数据
     * @param data
     */
    function getDataBase(data) {
      var base = angular.extend({}, data);
      base.birthday = getSubmitTime(base.birthday);
      base.onboarddate = getSubmitTime(base.onboarddate);
      _.map(base.roleStore, function (item) {
        return {"id": item};
      });
      base.positionid = getPositionid(base.position.posname, vm.position);
      var roleStore = [];
      angular.forEach(base.roleStore, function (item) {
        if (angular.isString(item)) {
          roleStore.push({"id": item});
        } else {
          roleStore.push(item);
        }
      });
      base.roleStore = roleStore;
      return base;
    }

    /**
     * 获取提交的的时间格式
     * @param time
     * @returns {*}
     */
    function getSubmitTime(time) {
      if (angular.isUndefined(time) || !time) {
        return "";
      }
      if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(time)) {
        return dateFilter(new Date(time), 'yyyy-MM-dd HH:mm:ss');
      }
      time.replace(/\-/, '/');
      return dateFilter(new Date(time + " 00:00:00"), 'yyyy-MM-dd HH:mm:ss');
    }

    /**
     * 提交数据
     */
    vm.submit = function () {
      if (vm.isChange) {
        memberEmployee.update(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", results.data.data);
          }
        });
      } else {
        memberEmployee.add(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", results.data.data);
          }
        });
      }
    };

    /**
     * 跳转页面
     */
    function goto() {
      $state.go('member.employee.list', {'page': 1});
    }

  }
})();

