/**
 * Created by Administrator on 2016/10/17.
 */
/**
 * simpleGrid是一个通用的表格组件
 * 包括表格数据，分页，自定义列表项，导出，新增等按钮，全选，本地排序和服务端排序
 * columns 是列表配置参数
 * store   是列表数据
 * config  全局配置参数
 * loadingState  加载数据状态
 * paginationInfo  分页配置
 * renderTable 这是一个事件，渲染表格
 * selectionChange  单选和全选触发事件 返回选中的所有数据
 *
 *
 * columns 参数配置(以下无默认参数)   必填
 *    cssProperty     当前列表项的class
 *    field           排序项   和后台排序有关，需要和后台确定
 *    name            表头显示标题
 *    fieldDirective  数据列表显示内容
 *    sort            排序形式，（客户端false还是服务端true）       默认客户端
 *    none            不用显示
 *    width           一个单元格宽度
 *
 * paginationinfo  分页配置      必填
 *    page       当前页面        默认1
 *    pageSize   一页多少条数据   默认10
 *    total      总数据          默认0
 *
 * store 列表数据(以下无默认参数)    必填
 *    注意数据需要和columns里的fieldDirective对应
 *
 * config    全局配置参数
 *    columnsClass       tr上面加class     {'classname' : true添加，false不添加}
 *    sortSupport        是否开启排序       默认false
 *    sortPrefer      排序形式（客户端false还是服务端true）       默认false客户端
 *    settingPrefer   自定义列表项配置
 *        necessarySettings       不能修改的列表项
 *        remixCustomSettings     所有列表项
 *        currentCustomSettings   当前列表项
 *    settingColumnsSupport  是否开启自定义列表项     默认false
 *    checkboxSupport        是否开启全选单选        默认false
 *    paginationSupport      是否开启分页            默认false
 *    isActiveClass          是否当前显示Class       默认true
 *    activeClass            当前显示class           默认active
 *    paginationInfo      分页配置参数
 *        分页配置参数
 *        maxSize            最大页数
 *        showPageGoto       是否开启手动输入跳转页       默认false
 *    noneDataInfoDirective    // 没有数据显示状态指令    默认'simple-grid-none-data'
 *    noneDataInfoMessage      // 没有数据显示状态文字    默认 '没有数据'
 *    selectedProperty         // 数据列表项复选框value值    默认selected
 *    selectedScopeProperty     // 复选框的作用域    默认selectedItems
 *    exportDataSupport         //是否开启导出       默认false
 *    addColumnsBarDirective          //新增按钮指令       数组形式，每项都是一个操作指令
 *    batchOperationBarDirective     //批量操作栏指令        数组形式，每项都是一个操作指令
 *
 *
 *
 */

(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleGrid', simpleGrid);

  /** @ngInject */
  function simpleGrid($compile, $filter) {
    function initGrid(scope) {
      // 筛选显示

      // 生成表格
      return initTable(scope);
    }

    function initTable(scope) {
      // 头部显示
      var tHead = tHeadConfig(scope);
      // 列表显示
      var tBody = tBodyConfig(scope);

      return '<table class="table table-hover">' + tHead + tBody + "</table>";
    }

    function initAddButton(scope) {
      var botton = "";
      if (scope.config.addColumnsBarDirective.length == 0) {
        return "";
      }
      angular.forEach(scope.config.addColumnsBarDirective, function (item) {
        botton += item;
      });
      return '<div class="pull-left">' + botton + '</div>';
    }

    function initSettings(scope) {
      var setting = "";
      if (scope.config.exportDataSupport) {
        setting += '<div class="export pull-left">' + exportDataConfig(scope) + '</div>';
      }
      if (scope.config.settingColumnsSupport) {
        setting += '<div class="setting pull-left">' + settingColumnsConfig(scope) + '</div>';
      }
      return '<div class="pull-right">' + setting + '</div>';
    }

    // 导出数据
    function exportDataConfig() {
      return '<a cb-access-control="{{requestParams.permission}}" export-data="{{requestParams.request}}" params="requestParams.params" class="btn btn-default list-tool-bar-button"  target="_blank"><span>导出数据</span></a>'
    }

    // 自定义列表项
    function settingColumnsConfig() {
      return '<button table-columns-preferences settings="setting" class="btn btn-default list-tool-bar-button"><span class="icon-setup">自定义列表项</span></button>'
    }

    function checkboxConfig(checked) {
      var cell = checked ? "th" : "th",
        text = checked ? "序号" : "全选",
        checkbox = checked ? "" : '<input style="vertical-align:middle; margin-top:0;" type="checkbox" ng-model="tableState.selectAll" ng-change="changeSelectionAll()" />',
        label = checkbox ? "<label style='font-size:12px; font-family:Tahoma;cursor: pointer;'>" + checkbox + text + "</label>" : text;
      return "<" + cell + ' style="width:60px;min-width:60px;">' + label + '</' + cell + ">";
    }

    function tHeadConfig(scope) {
      var node = "";
      if (scope.config.checkboxSupport) {
        node += checkboxConfig(false);
      }
      angular.forEach(scope.columns, function (item) {
          var name = item.units ? item.name + item.units : item.name;
          if (scope.config.sortSupport && item.field) {
            var sortHandler = scope.config.sortPrefer ? 'serverSortHandler' : 'clientSortHandler';

            node += '<th ' + (item.width ? 'style="min-width:' + item.width + 'px;"' : "") + ' ng-click="' + sortHandler + '(\'' + item.field + '\', sortReverse)">' + name + '<span class="icon-updown" ng-class="{\'dropup\': sortReverse[\'' + item.field + '\']}"><i class="caret"></i></span></th>';
          } else {
            if (!item.none) {
              node += '<th ' + (item.width ? 'style="min-width:' + item.width + 'px;"' : "") + '>' + name + '</th>';
            }
          }
        }
      );
      return "<thead><tr>" + node + "</tr></thead>";
    }

    function tBodyConfig(scope) {
      // 设置单个复选框
      var itemList = scope.itemList || "store",
        bindonce = scope.config.useBindOnce ? 'bindonce' : "",
        rowItemName = scope.rowItemName ? scope.rowItemName : "item",
        node = "";
      if (scope.config.checkboxSupport) {
        scope.selectedScopeProperty = scope.selectedScopeProperty || "selectedItems";
        var model = rowItemName + "." + scope.selectedProperty;
        node = '<td width="70"><label style="font-size:12px; font-family:Tahoma;cursor: pointer;"><input style="vertical-align:middle; margin-top:0;" type="checkbox" ng-model="' + model + '" ng-change="changeSelection({data: ' + rowItemName + '})"/>{{$index+1}}</label></td>';
      }
      angular.forEach(scope.columns, function (item) {
        if (!item.none) {
          node += '<td ' + (item.width ? 'style="min-width:' + item.width + 'px;"' : "") + '>' + item.fieldDirective + '</td>';
        }
      });

      var statusShowClass = scope.config.isActiveClass ? ' ng-class="{' + scope.config.activeClass + ': item.$$active}" ' : "";
      var columnsClass = scope.config.columnsClass ? ' class="' + scope.config.columnsClass + '" ' : "";
      return '<tbody ng-if="!loadingState"><tr ng-click="selectItem(item)" ' + statusShowClass + ' ' + bindonce + ' ' + columnsClass + ' ng-repeat="' + rowItemName + " in " + itemList + '">' + node + "</tr></tbody>"
    }

    function tFootConfig(scope) {
      var node = "", btn = "", page = "", config = scope.config;

      if (config.batchOperationBarDirective.length > 0) {    // 添加批量操作按钮
        btn = '<div class="simple-grid-tfoot-batch-warp pull-left">';
        angular.forEach(config.batchOperationBarDirective, function (item) {
          btn += item;
        });
        btn += '</div>';
      }
      if (config.paginationSupport && !scope.showNoneDataInfoTip) {    //添加分页
        page = '<div class="simple-grid-page-warp pull-right" simple-grid-pagination pagination-info="paginationInfo" max-size="config.paginationInfo.maxSize"' + ' on-select-page="pageSelectChanged(page)" show-page-goto="' + config.paginationInfo.showPageGoto + '"></div></div>';
      }

      node +=  btn;
      node += page;
      return node;
    }

    function noData(scope) {
      var noneData = 'simple-grid-none-data',
        infoMsg = '没有数据哦';
      if (scope.config.noneDataInfoDirective) {
        noneData = scope.config.noneDataInfoDirective;
      }
      if (scope.config.noneDataInfoMessage) {
        infoMsg = scope.config.noneDataInfoMessage;
      }
      return '<div class="simple-grid-none-data text-center" ' + noneData + ' info-msg="' + infoMsg + '" ng-if="showNoneDataInfoTip && !loadingState" ></div>'
    }

    /**
     * 默认参数
     * @type {{columnsClass: null, sortSupport: boolean, sortPrefer: boolean, settingPrefer: {necessarySettings: Array, remixCustomSettings: Array, currentCustomSettings: Array}, settingColumnsSupport: boolean, checkboxSupport: boolean, paginationSupport: boolean, paginationInfo: {maxSize: number, showPageGoto: boolean}, propsParams: {}, noneDataInfoDirective: string, noneDataInfoMessage: string, selectedProperty: string, selectedScopeProperty: string, exportDataSupport: boolean, addColumnsBarDirective: Array, batchOperationBarDirective: Array}}
     */
    var DEFAULT_CONFIG = {
      columnsClass: null,       //tr上面加class     {'classname' : true添加，false不添加}
      sortSupport: false,        //是否开启排序
      sortPrefer: false,      //排序形式（客户端false还是服务端true）
      settingPrefer: {        //自定义列表项配置    必填项
        necessarySettings: [],   //不能修改的列表项
        remixCustomSettings: [],     //所有列表项
        currentCustomSettings: []   //当前列表项
      },
      settingColumnsSupport: false,  //是否开启自定义列表项
      checkboxSupport: false,        //是否开启全选单选
      paginationSupport: false,      //是否开启分页
      paginationInfo: {              //分页配置参数
        maxSize: 5,                 //最大页数
        showPageGoto: false        //是否开启手动输入跳转页
      },
      isActiveClass: true,          // 是否当前显示Class
      activeClass: 'active',          //  当前显示class
      propsParams: {},               // 给子组件传递数据  提供子指令和控制器交互数据
      noneDataInfoDirective: 'simple-grid-none-data',    // 没有数据显示状态指令
      noneDataInfoMessage: '没有数据',      // 没有数据显示状态文字
      selectedProperty: 'selected',         // 数据列表项复选框value值
      selectedScopeProperty: 'selectedItems',     // 复选框的作用域
      exportDataSupport: false,           //是否开启导出
      addColumnsBarDirective: [],         //新增按钮指令       每项都是一个操作指令
      batchOperationBarDirective: []      //批量操作栏指令        每项都是一个操作指令
    };

    /**
     * 检测是否全选

     * @param scope
     * @returns {{selectAll: boolean, results: Array}}
     */
    function getTableStateAll(scope) {
      if (!scope.store.length) {
        return {
          selectAll: false,
          results: []
        }
      }
      var selected = scope.config.selectedProperty,
        store = scope.store,
        results = _.filter(store, function (item) {
          return item[selected];
        });
      return {
        selectAll: results.length === store.length,
        results: results
      }
    }

    return {
      restrict: "A",
      scope: {
        columns: "=",      // 列表项
        store: "=",        // 数据
        config: "=",       // 配置
        requestParams: "=",   // 导出配置
        loadingState: "=",  // 数据加载
        paginationInfo: "=",  // 分页配置
        selectionChange: "&",  // 多选单选回调
        sortChanged: "&",       // 服务端排序回调
        pageChanged: "&",   // 分页点击回调
        selectHandler: "&"   // 分页点击回调
      },
      templateUrl: "app/components/simpleGrid/simpleGrid.html",
      controller: ["$scope", function ($scope) {
        // config 配置默认参数
        $scope.config = angular.extend({}, DEFAULT_CONFIG, $scope.config);
        // 给子组件传递数据
        $scope.propsParams = $scope.config.propsParams;

        // 排序配置  （客户端false 服务端true）
        if ($scope.config.sortSupport) {
          $scope.sortReverse = {};
        }
        // 客户端排序
        $scope.clientSortHandler = function (name, data) {
          data[name] = !data[name];
          $scope.store = $filter("orderBy")($scope.store, name, !data[name]);
        };

        // 服务端排序
        $scope.serverSortHandler = function (name, data) {
          data[name] = !data[name];
          var result = {};

          result[name] = data[name] ? "ASC" : "DESC";
          $scope.sortChanged({
            data: {
              name: name,
              data: result
            }
          })
        };

        // 自定义设置
        $scope.setting = $scope.config.settingPrefer;

        // 全选
        $scope.changeSelectionAll = function () {
          var config = $scope.config,
            selected = config.selectedProperty,
            selectAll = $scope.tableState.selectAll,
            disabled = config.checkboxDisabledProperty,
            results = [];
          angular.forEach($scope.store, function (value) {
            !disabled && (value[selected] = selectAll);
            selectAll && results.push(value);
          });
          $scope.selectionChangeHandler(results);
        };

        // 单个选中
        $scope.changeSelection = function () {
          var tableState = getTableStateAll($scope);
          $scope.tableState.selectAll = tableState.selectAll;
          console.log($scope.tableState.selectAll);
          $scope.selectionChangeHandler(tableState.results);
        };

        // 单选和全选触发事件
        $scope.selectionChangeHandler = function (item) {
          $scope.config.selectedItems = item;
          $scope.selectionChange({data: item});
        };

        // 分页监听
        $scope.pageSelectChanged = function (page) {
          $scope.pageChanged({page: page});
        };

        // 点击当前项
        $scope.selectItem = function (item) {
          $scope.selectHandler({item: item});
          $scope.config.isActiveClass && setItemActive(item);
        };
        // 清除全部状态，设置当前状态
        function setItemActive(item) {
          _.forEach($scope.store, function (key) {
            key.$$active = false;
          });
          item.$$active = true;
        }
      }],
      link: function (scope, iElement) {
        var iEle = angular.element(iElement);
        // 配置单个复选框 ng-model名
        scope.selectedProperty = scope.config.selectedProperty;
        // 表格状态
        scope.tableState = {
          selectAll: false
        };
        // 监听columns
        scope.$watch('columns', function () {
          // 初始化表格无数据显示
          iEle.find('.simple-grid-none-data-wrap').html(noData(scope));
          // 初始化表格设置
          iEle.find('.gridSettings').html(initAddButton(scope) + initSettings(scope));
          // 初始化表格数据
          iEle.find('.gridSection').html(initGrid(scope));
          // 初始化表格页脚
          iEle.find('.gridFoot').html(tFootConfig(scope));
          setGridSectionWidth();
          $compile(iEle.contents())(scope);
        });


        function setGridSectionWidth(){
          var results = _.reduce(scope.columns, function(result, value) {
            if(value.none){
              return result + 60;
            }else{
              return result + value.width;
            }
          }, 0);
          iEle.find('.gridSection table').css({minWidth: results});
        }

        // 监听store数据变化
        scope.$watch("store", function (newValue, oldVlaue, scope) {
          if (newValue) {
            (scope.config.isActiveClass && newValue[0]) && (scope.store[0].$$active = true);
            scope.showNoneDataInfoTip = newValue.length === 0;
            var tableState = getTableStateAll(scope);
            scope.tableState.selectAll = tableState.selectAll;
          }
        }, true);

      }
    }
  }
})();
