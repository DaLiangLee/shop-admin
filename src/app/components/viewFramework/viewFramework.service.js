/**
 * Created by Administrator on 2016/10/11.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('viewFrameworkContributor', viewFrameworkContributor)
    .factory("viewFrameworkSetting", viewFrameworkSetting);
  /** @ngInject */
  function viewFrameworkContributor() {
    var service = {
      sidebarFold: true,
      toggleSidebarStatus: toggleSidebarStatus
    };
    return service;
  }

  function toggleSidebarStatus(status) {
    this.sidebarFold = status;
  }

  /** @ngInject */
  function viewFrameworkSetting($window, $rootScope, $state, $q, viewFrameworkHelper) {
    if (!$rootScope.viewFrameworkConfig) {
      var setting = {
        version: null,            //版本
        hideTopbar: false,        //是否隐藏顶栏
        hideSidebar: false,       //是否隐藏侧边栏
        disableNavigation: false, //是否禁用导航
        embed: false,             //是否嵌入
        sidebar: "full",          //侧边栏显示状态mini收缩full展开
        topbarNavLinks: null,
        ramTag: "",
        exclusiveStates: []
      };
      viewFrameworkHelper.init(setting);
      $window.viewFrameworkConfig = $rootScope.viewFrameworkConfig = setting;
    }
    var promise = $q.defer();
    return {
      promise: promise,
      config: $rootScope.viewFrameworkConfig,
      /**
       * 设置配置
       * @param config
       * @param r
       */
      setConfig: function (config, r) {
        if (r) {
          $rootScope.viewFrameworkConfig = config;
        } else {
          $rootScope.viewFrameworkConfig = angular.extend($rootScope.viewFrameworkConfig, config);
          viewFrameworkHelper.init($rootScope.viewFrameworkConfig)
        }
      },
      /**
       * 设置版本
       */
      setVersion: function (version) {
        $rootScope.viewFrameworkConfig.version = version;
        viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
      },
      /**
       * 设置顶栏显示
       */
      setShowTopbar: function () {
        $rootScope.viewFrameworkConfig.hideTopbar = true;
        viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
      },
      /**
       * 设置侧边栏显示
       */
      setShowSidebar: function () {
        $rootScope.viewFrameworkConfig.hideSidebar = true;
        viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
      },
      /**
       * 设置顶栏隐藏
       */
      setHideTopbar: function () {
        $rootScope.viewFrameworkConfig.hideTopbar = false;
        viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
      },
      /**
       * 设置侧边栏隐藏
       */
      setHideSidebar: function () {
        $rootScope.viewFrameworkConfig.hideSidebar = false;
        viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
      },
      /**
       * 设置禁用导航
       * @param disable
       */
      setDisableNavigation: function (disable) {
        $rootScope.viewFrameworkConfig.disableNavigation = disable;
      },
      setSidebar: function (e) {
        $rootScope.viewFrameworkConfig.sidebar = e;
      },
      setExclusiveStates: function (e) {
        $rootScope.viewFrameworkConfig.exclusiveStates = e;
      },
      setTopbarNavLinks: function (e) {
        $rootScope.viewFrameworkConfig.topbarNavLinks = e;
      },
      onReady: function (e) {
        promise.promise.then(function () {
          e();
        });
      },
      isExclusiveOperation: function () {
        var r = $rootScope.viewFrameworkConfig.exclusiveStates,
          i = false;
        return angular.forEach(r, function (e) {
          !i && $state.includes(e) && (i = true)
        }), i
      }
    }
  }
})();
