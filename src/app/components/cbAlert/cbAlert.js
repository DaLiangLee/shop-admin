/**
 * Created by Administrator on 2016/11/19.
 */
(function() {
  'use strict';
  function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
      i,
      humpString = [],
      htmlStyle = document.documentElement.style,
      _toHumb = function (string) {
        return string.replace(/-(\w)/g, function ($0, $1) {
          return $1.toUpperCase();
        });
      };

    for (i in prefix){
      humpString.push(_toHumb(prefix[i] + '-' + style));
    }

    humpString.push(_toHumb(style));

    for (i in humpString){
      if (humpString[i] in htmlStyle) {
        return true;
      }
    }

    return false;
  }
  angular
    .module('shopApp')
    .factory('cbAlert', cbAlert);

    /**
     * alert弹窗
     * @param options   配置参数
     * @param callback  回调函数 可以通过返回的做其他操作参数是否确定 isConfirm
     * @param status    回调操作之后返回的状态
     * @constructor
     */
    var AlertDialog = function(options, callback, status){
        this.init(options, callback, status);
    };
    AlertDialog.VERSION = '1.0.0';
    AlertDialog.DEFAULTS = {
      title: '',       //标题
      text: '',        //提示文字
      type: null,      //类型
      allowOutsideClick: false,   //允许外部点击
      showConfirmButton: true,    //显示确认按钮
      showCancelButton: false,    //显示取消按钮
      closeOnConfirm: true,       //关闭确认
      closeOnCancel: true,        //关闭取消
      confirmButtonText: '确定',    //确认按钮文字
      cancelButtonText: '取消', //取消按钮文字
      doneFunctionExists: false,   //是否有回调函数
      imageUrl: null,   //图片url
      delay: null,     //延迟时间
      customClass: '',   //自定义类
      html: false,       //html标签
      animation: true,   //是否有动画
      allowEscapeKey: true,  //允许退出键
      inputType: 'text',   //输入框类型
      inputPlaceholder: '',  //输入框占位符
      inputValue: '',       //输入框的值
      showLoaderOnConfirm: false   // 显示加载器确认
    };
    AlertDialog.close = function(){
      angular.element('body').removeClass('.stop-scrolling').find('.k-alert-dialog').hide().remove();
    };
    AlertDialog.prototype.constructor = AlertDialog;
    /**
     * 初始化
     */
    AlertDialog.prototype.init = function(){
      this.isAnimation = supportCss3('animation');
      this.timer = null;
      this.$modal = null;
      this.option = this._getOptions(this._getDefaults(), arguments);
      this.mount();
      this._openModal(arguments[1]);
    };
    AlertDialog.prototype.isModal = function(){
      return angular.element('body').find('.k-alert-dialog').length;
    };
    /**
     * 获取配置
     * @param defaultParams  默认配置
     * @param userParams     用户配置
     * @returns {}           返回配置
     * @private
     */
    AlertDialog.prototype._getOptions = function (defaultParams, userParams) {
      if (!userParams[0]) {
        throw new Error('options 必填的');
      }
      var params;

      if(angular.isString(userParams[0])){
        params = angular.extend({}, defaultParams);
        params.title = userParams[0];
        params.text  = userParams[1] || '';
        params.type  = userParams[2] || '';
      }else if(angular.isObject(userParams[0])){
        if (!userParams[0].title) {
          throw new Error('options 没有写‘title’');
        }
        if (!userParams[0].type) {
          throw new Error('options 没有写‘type’');
        }
        params = angular.extend(defaultParams, userParams[0]);
        if (userParams[0].imageUrl) {
          params.type = 'custom';
        }
        params.doneFunctionExists = angular.isFunction(userParams[1]);
      }else{
        throw new Error('options 不是一个json对象');
      }
      return params;
    };
    /**
     * 获取默认参数
     * @returns {}    默认参数
     * @private
     */
    AlertDialog.prototype._getDefaults = function () {
      return angular.copy(AlertDialog.DEFAULTS);
    };
    /**
     * 根据el, template, render方法等属性，会生成DOM，并添加到对应位置。
     */
    AlertDialog.prototype.mount = function () {
      var _this = this;
      var element = angular.element;
      if(!this.isModal()){
        this.$modal = element('<div class="k-alert-dialog" tabindex="-1"></div>');
        this.$modal.append(element('<div class="alert-overlay"></div>'));
        this.$modal.append('<div class="alert-dialog" data-animation="pop">'+template()+'</div>');
        element('body').append(this.$modal).addClass('stop-scrolling');
        this.$modal.show().find('.alert-dialog').addClass('showAlertDialog');
      }else{
        this.$modal = element('body').find('.k-alert-dialog');
        this.$modal.find('.alert-dialog').html(template()).show();
      }
      if(this.isAnimation){
        this.$modal.find('.success').addClass('animate');
        this.$modal.find('.success .tip').delay(4200).addClass('animateSuccessTip');
        this.$modal.find('.success .long').delay(5000).addClass('animateSuccessLong');
      }else{
        this.$modal.addClass('notAnimation');
      }
      this.option.customClass && this.$modal.addClass(this.option.customClass);
      function template(){
        var dialog = "";
        var icon = "",inputBox = "";
        switch (_this.option.type){
          case 'none':
            /**
             * 错误
             */
            icon = '';
            break;
          case 'error':
            /**
             * 错误
             */
            icon = '<div class="icon error animate"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div>';
            break;
          case 'warning':
            /**
             * 警示
             */
            icon = '<div class="icon warning pulseWarning"><span class="body pulseWarningIns"></span><span class="dot pulseWarningIns"></span></div>';
            break;
          case 'info':
            /**
             * 信息
             */
            icon = '<div class="icon info"></div>';
            break;
          case 'success':
            /**
             * 成功
             */
            icon = '<div class="icon success"><span class="line tip"></span><span class="line long"></span><div class="placeholder"></div><div class="fix"></div></div>';
            break;
          case 'custom':
            /**
             * 自定义
             */
            icon = '<div class="icon custom"><img src="'+_this.option.imageUrl+'" alt=""></div>';
            break;
          case 'input':
            /**
             * 自定义
             */
            inputBox = '<div class="input-container"><input class="input" type="'+ _this.option.inputType +'" placeholder="'+ _this.option.inputPlaceholder +'" value="'+ _this.option.inputValue +'" /><div class="error-container"><div class="icons">!</div><p>请输入内容！</p></div></div>';
            break;
        }
        var title = '<h3 class="title">'+ _this.option.title +'</h3>';
        var text = "";
        if(_this.option.html){
          text = '<div class="text">'+ _this.option.text +'</div>';
        }else{
          text = '<p class="text">'+ _this.option.text +'</p>';
        }
        var buttonBox = '';
        /**
         * 异步加载使用
         */
        var loaderBallFall = _this.option.showLoaderOnConfirm ? '<div class="loader-ball-fall"><div></div><div></div><div></div></div>' : "";
        if(_this.option.showConfirmButton && _this.option.showCancelButton){
          buttonBox = '<div class="button-container"><button class="confirm" tabindex="1">'+_this.option.confirmButtonText+'</button><button class="cancel" tabindex="2">'+_this.option.cancelButtonText+'</button>'+loaderBallFall+'</div>';
        }else if(!_this.option.showConfirmButton && !_this.option.showCancelButton){
          buttonBox = "";
        }else{
          buttonBox = '<div class="button-container">';
          if(_this.option.showConfirmButton){
            buttonBox += '<button class="confirm" tabindex="1">'+_this.option.confirmButtonText+'</button>';
          }
          if(_this.option.showCancelButton){
            buttonBox += '<button class="cancel" tabindex="2">'+_this.option.cancelButtonText+'</button>';
          }
          buttonBox += loaderBallFall +"</div>";
        }
        icon && (dialog += icon);
        dialog += title;
        dialog += text;
        if(_this.option.showLoaderOnConfirm){
          dialog += '<p class="show-loader-text">正在提交中。。。</p>';
        }
        inputBox && (dialog += inputBox);
        buttonBox && (dialog += buttonBox);
        return dialog;
      }
    };
    /**
     * 打开弹窗
     */
    AlertDialog.prototype._openModal = function (callback) {
      this.handleButton(callback);
    };
    /**
     * 给按钮绑定事件
     */
    AlertDialog.prototype.handleButton = function (callback) {
      var _this = this;
      var $confirm = this.$modal.find('.confirm');
      var $cancel= this.$modal.find('.cancel');
      var $input = this.$modal.find('.input');

      this.option.allowOutsideClick && this.$modal.on('click', '.alert-overlay', function () {
        _this.close();
      });
      /**
       * 确定事件
       */
      $confirm.on('click', function () {
        if(_this.option.doneFunctionExists){
          if(_this.option.type === 'input'){
            if(_.trim($input.val())){
              _this.option.showLoaderOnConfirm && setLoader();
              callback($input.val());
              _this.close();
            }
            $input.siblings('.error-container').toggleClass('show', !_.trim($input.val()));
          }else{
            callback(true);
            if(_this.option.showLoaderOnConfirm){
              setLoader();
            }
          }
        }else{
          _this.close();
        }
      });
      function setLoader(){
        $confirm.prop("disabled", true);
        $cancel.prop("disabled", true);
        _this.$modal.find('.loader-ball-fall').css({
          width: $confirm.outerWidth(),
          height: $confirm.outerHeight(),
          left: $confirm.position().left +5,
          top: $confirm.position().top +26
        }).show();
        _this.$modal.find('.show-loader-text').show();
      }
      $input.on('input', function () {
        $input.siblings('.error-container').toggleClass('show', !_.trim($input.val()));
      });
      /**
       * 取消事件
       */
      $cancel.on('click', function () {
        if(_this.option.doneFunctionExists){
          callback(false, _this);
        }else{
          _this.close();
        }
      });
      /**
       * 自动取消
       */
      if(this.option.delay != null && this.option.delay != '' && angular.isNumber(this.option.delay)){
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          _this.close();
        }, this.option.delay);
      }
    };
    /**
     * 当数据发生变化后，会重新渲染DOM，并进行替换
     */
    AlertDialog.prototype.close = function () {
      var _this = this;
      if(this.isAnimation){
        this.$modal.find('.alert-overlay').fadeOut(250);
        this.$modal.find('.alert-dialog').fadeOut(250, function () {
          _this.$modal.remove();
          _this.destory();
        });
        this.$modal.find('.alert-dialog').removeClass('showAlertDialog').addClass('hideAlertDialog');
      }else{
        this.$modal.fadeOut(250).remove();
      }
      return true;
    };
    /**
     * 销毁时运行
     */
    AlertDialog.prototype.destory = function () {
      this.$modal = null;
      angular.element('body').removeClass('stop-scrolling');
      clearTimeout(this.timer);
    };
  /** @ngInject */
  function cbAlert($rootScope, $timeout){
    var temporary = null;
    return {
      dialog: function( arg1, arg2, arg3 ) {      // 自定义提示，警告，输入框
        $rootScope.$evalAsync(function(){
          if( angular.isFunction(arg2) ) {
            temporary = new AlertDialog( arg1, function(isConfirm){
              $rootScope.$evalAsync( function(){
                arg2(isConfirm);
              });
            }, arg3 );
          } else {
            new AlertDialog( arg1, arg2, arg3 );
          }
        });
      },
      alert: function( arg1, arg2, arg3 ) {       // alert警告框
        $rootScope.$evalAsync(function(){
          new AlertDialog( arg1, arg2, arg3 );
        });
      },
      ajax: function(title, callback, message, type){    // ajax提交提醒框确认框
        $rootScope.$evalAsync(function(){
          if(!angular.isFunction(callback)){
            throw Error('callback is not a function');
          }
          temporary = new AlertDialog({
            title: title,       //标题
            text: message ||　"",        //提示文字
            type: type || 'none',
            showConfirmButton: true,    //显示确认按钮
            showCancelButton: true,    //显示取消按钮
            showLoaderOnConfirm: true  //显示提交效果
          }, function(isConfirm){
            $rootScope.$evalAsync( function(){
              callback(isConfirm);
            });
          });
        });
      },
      reconfirm: function (parameter) {   // 2次确认提醒框，防止用户误操作
        $rootScope.$evalAsync(function(){
          if(!angular.isFunction(callback)){
            throw Error('callback is not a function');
          }
          temporary = new AlertDialog({
            title: parameter.once.title,       //标题
            text: parameter.once.message ||　"",        //提示文字
            type: parameter.once.type || 'none',
            showConfirmButton: true,    //显示确认按钮
            showCancelButton: true    //显示取消按钮
          }, function(isConfirm){
            if(isConfirm){
              $rootScope.$evalAsync(function(){
                if(!angular.isFunction(parameter.twice.callback)){
                  throw Error('callback is not a function');
                }
                temporary = new AlertDialog({
                  title: parameter.twice.title,       //标题
                  text: parameter.twice.message ||　"",        //提示文字
                  type: parameter.twice.type || 'none',
                  showConfirmButton: true,    //显示确认按钮
                  showCancelButton: true,    //显示取消按钮
                  showLoaderOnConfirm: true  //显示提交效果
                }, function(isReconfirm){
                  $rootScope.$evalAsync( function(){
                    parameter.twice.callback(isReconfirm);
                  });
                });
              });
            }else{
              temporary.close();
              temporary = null;
            }
          });
        });
      },
      confirm: function (title, callback, message, type) {    // 确认框
        $rootScope.$evalAsync(function(){
          if(!angular.isFunction(callback)){
            throw Error('callback is not a function');
          }
          temporary = new AlertDialog({
            title: title,       //标题
            text: message ||　"",        //提示文字
            type: type || 'none',
            showConfirmButton: true,    //显示确认按钮
            showCancelButton: true    //显示取消按钮
          }, function(isConfirm){
            $rootScope.$evalAsync( function(){
              callback(isConfirm);
            });
          });
        });
      },
      prompt: function (title, callback) {    // 输入框
        $rootScope.$evalAsync(function(){
          if(!angular.isFunction(callback)){
            throw Error('callback is not a function');
          }
          $rootScope.$evalAsync(function(){
            temporary = new AlertDialog({
              title: title,       //标题
              text: '',        //提示文字
              showConfirmButton: true,    //显示确认按钮
              showCancelButton: true    //显示取消按钮
            }, function(isConfirm){
              $rootScope.$evalAsync( function(){
                callback(isConfirm);
              });
            });
          });
        });
      },
      tips: function(title, delay, type) {   // 消息提醒框，2秒后自动消失
        $rootScope.$evalAsync(function(){
          new AlertDialog({
            title: title,       //标题
            text: '',        //提示文字
            type: type || 'success',      //类型
            showConfirmButton: false,    //显示确认按钮
            delay: delay || 2000     //延迟时间
          });
        });
      },
      success: function(title, message) {   // 成功显示框
        $rootScope.$evalAsync(function(){
          new AlertDialog( title, message || "", 'success' );
        });
      },
      error: function(title, message) {    // 失败显示框
        $rootScope.$evalAsync(function(){
          new AlertDialog( title, message || "", 'error' );
        });
      },
      warning: function(title, message) {  // 警告显示框
        $rootScope.$evalAsync(function(){
          new AlertDialog( title, message || "", 'warning' );
        });
      },
      info: function(title, message) {    // 信息显示框
        $rootScope.$evalAsync(function(){
          new AlertDialog( title, message || "", 'info' );
        });
      },
      close: function() {             // 关闭所有框
        $rootScope.$evalAsync(function(){
          temporary.close();
          temporary = null;
        });
      }
    }
  }

})();
