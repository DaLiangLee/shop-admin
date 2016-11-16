/**
 * Created by Administrator on 2016/11/15.
 */
(function() {
  'use strict';
  /**
   * observer 观察者
   * @method register    注册
   * @method fire        发布
   * @method remove      取消
   */
  angular
    .module('shopApp')
    .factory('observer', observer);

  /** @ngInject */
  function observer() {
    var _messages = {};
    return {
      register: function(type, fn) {
        if(_.isUndefined(_messages[type])){
          _messages[type] = [fn];
        }else{
          _messages[type].push(fn);
        }
      },
      fire: function(type, opt) {
        if(_.isUndefined(_messages[type])){
          return false;
        }
        _.forEach(_messages[type], function (item) {
          item(opt);
        });
      },
      remove: function (type, fn) {
        var i = _.findIndex(_messages[type], fn);
        if(_.isUndefined(_messages[type]) || i == -1){
          return false;
        }
        _messages[type].splice(i, 1);
      }
    };
  }
})();
