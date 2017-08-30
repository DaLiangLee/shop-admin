(function() {
    'use strict';
    angular
        .module('shopApp')
        .provider('$simpleDialog', $simpleDialog)
        .controller('simpleDialogController', simpleDialogController)
        .service('simpleDialogService', simpleDialogService)

    /** @ngInject */
    function $simpleDialog() {
        var defaults = this.defaults = {
            animation: 'am-fade', // 动画形式
            backdropAnimation: 'am-fade', // 动画形式
            customClass: '', // 自定义class
            prefixClass: 'simple-dialog', // 自定义class前缀
            prefixEvent: 'simpleDialog', // 自定义事件前缀
            placement: 'top', // 显示位置
            templateUrl: 'dialog/dialog.tpl.html', // 模板地址
            template: '', // 模板标识
            contentTemplate: false, // 内容模板
            backdrop: true, // 对话框遮罩
            keyboard: true, // 是否可以ESC关闭
            html: false, // 选择绑定模式
            size: null, // 尺寸
            zIndex: null // 自定义层级
        };
        this.$get = function($rootScope, $injector, $compile, $controller, $http, $templateCache, $q, $log, $window, $sce, $animate) {
            // 获取body
            var bodyElement = angular.element($window.document.body);
            // 对话框遮罩初始化计数
            var backdropCount = 0;
            // 对话框初始化层级
            var dialogBaseZindex = 1060;
            // 对话框遮罩初始化层级
            var backdropBaseZindex = 1050;
            // 显示尺寸 默认simple-dialog
            var validSizes = {
                lg: 'dialog-lg',
                sm: 'dialog-sm'
            };
            /**
             * 对话框工厂函数
             * @param {any} config
             */
            function DialogFactory(config) {
                // 声明模态对象
                var _dialog = {};
                // 获取配置参数
                var options = _dialog.$options = angular.extend({}, defaults, config);
                // 加载编译模板
                var promise = _dialog.$promise = compile(options);
                // 创建作用域
                var scope = _dialog.$scope = options.scope && options.scope.$new() || $rootScope.$new();

                // 设置层级
                if (options.zIndex) {
                    dialogBaseZindex = parseInt(options.zIndex, 10);
                    backdropBaseZindex = dialogBaseZindex - 10;
                }

                // Support scope as string options
                angular.forEach(['title', 'content'], function(key) {
                    if (options[key]) scope[key] = $sce.trustAsHtml(options[key]);
                });

                // Provide scope helpers
                scope.$close = function(source) {
                    scope['$$postDigest'](function() {
                        _dialog.close(source);
                    });
                };
                scope.$open = function() {
                    scope['$$postDigest'](function() {
                        _dialog.open();
                    });
                };
                // 声明编译数据
                var compileData;
                // 声明对话框元素
                var dialogElement;
                // 声明对话框作用域
                var dialogScope;
                // 声明创建对话框遮罩
                var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
                // 加载数据
                promise.then(function(data) {
                    compileData = data;
                });

                /**
                 * 对话框销毁
                 */
                _dialog.destroy = function() {
                    // Remove element
                    destroyDialogElement();

                    // remove backdrop element
                    if (backdropElement) {
                        backdropElement.remove();
                        backdropElement = null;
                    }

                    // Destroy scope
                    scope.$destroy();
                };

                /**
                 * 打开对话框
                 */
                _dialog.open = function() {
                    // 如果已经打开就直接退出执行 说明已经执行过了
                    if (_dialog.isOpen) {
                        return;
                    }
                    // 如果对话框存在就销毁
                    if (dialogElement) destroyDialogElement();
                    // 对话框作用域赋值 创建一个新的作用域
                    dialogScope = _dialog.$scope.$new();
                    // 获取对话框元素
                    dialogElement = _dialog.$element = compileData.link(dialogScope, function() {});

                    if (options.backdrop) {
                        // set z-index
                        dialogElement.css({ 'z-index': dialogBaseZindex + (backdropCount * 20) });
                        backdropElement.css({ 'z-index': backdropBaseZindex + (backdropCount * 20) });

                        // increment number of backdrops
                        backdropCount++;
                        $rootScope.dialogBaseZindex = dialogBaseZindex + (backdropCount * 20);
                    }
                    // 给父作用域发送自定义打开之前事件， 如果返回false就不要继续执行了
                    if (scope.$emit(options.prefixEvent + '.open.before', _dialog).defaultPrevented) {
                        return;
                    }
                    // 如果配置打开之前事件存在就调用，把_dialog对象传给它作为参数
                    if (angular.isDefined(options.onBeforeOpen) && angular.isFunction(options.onBeforeOpen)) {
                        options.onBeforeOpen(_dialog);
                    }
                    // 设置对话框位置
                    dialogElement.css({ display: 'block' }).addClass(options.placement);
                    // 给对话框添加自定义类
                    if (options.customClass) {
                        dialogElement.addClass(options.customClass);
                    }
                    // 设置对话框大小
                    if (options.size && validSizes[options.size]) {
                        angular.element(findElement(".dialog", dialogElement[0])).addClass(validSizes[options.size]);
                    }
                    // 设置对话框动画
                    if (options.animation) {
                        if (options.backdrop) {
                            backdropElement.addClass(options.backdropAnimation);
                        }
                        dialogElement.addClass(options.animation);
                    }
                    // 对话框遮罩动画
                    if (options.backdrop) {
                        $animate.enter(backdropElement, bodyElement, null);
                    }
                    $animate.enter(dialogElement, bodyElement, null, function() {
                        scope.$emit(options.prefixEvent + '.open', _dialog);
                        if (angular.isDefined(options.onOpen) && angular.isFunction(options.onOpen)) {
                            options.onOpen(_dialog);
                        }
                    });
                    dialogElement[0].focus();
                    bodyElement.addClass(options.prefixClass + '-open');
                    if (options.animation) {
                        bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
                    }
                    // 设置开启状态
                    _dialog.isOpen = scope.$isOpen = true;
                    safeDigest(scope);
                    // 绑定事件
                    bindBackdropEvents();
                    bindKeyboardEvents();
                };

                /**
                 * 关闭对话框
                 * @param {any} source 谁关闭对话框
                 */
                _dialog.close = function(source) {
                    // 如果没有打开就直接退出执行 说明已经执行过了
                    if (!_dialog.isOpen) {
                        return;
                    }
                    if (scope.$emit(options.prefixEvent + '.close.before', _dialog).defaultPrevented) {
                        return;
                    }
                    if (angular.isDefined(options.onBeforeClose) && angular.isFunction(options.onBeforeClose)) {
                        options.onBeforeClose(_dialog, source);
                    }
                    $animate.leave(dialogElement, function() {
                        scope.$emit(options.prefixEvent + '.close', _dialog);
                        if (angular.isDefined(options.onClose) && angular.isFunction(options.onClose)) {
                            options.onClose(_dialog, source);
                        }
                        if (findElement('.simple-dialog').length <= 0) {
                            bodyElement.removeClass(options.prefixClass + '-open');
                        }
                        if (options.animation) {
                            bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
                        }
                    });
                    if (options.backdrop) {
                        // decrement number of backdrops
                        backdropCount--;
                        $rootScope.dialogBaseZindex = dialogBaseZindex + (backdropCount * 20);
                        $animate.leave(backdropElement);
                    }
                    // 设置关闭状态
                    _dialog.isOpen = scope.$isOpen = false;
                    safeDigest(scope);
                    // 取消事件绑定
                    unbindBackdropEvents();
                    unbindKeyboardEvents();
                };
                /**
                 * 销毁对话框元素
                 */
                function destroyDialogElement() {
                    if (_dialog.$isOpen && dialogScope !== null) {
                        // un-bind events
                        unbindBackdropEvents();
                        unbindKeyboardEvents();
                    }
                    // 销毁对话框作用域
                    if (dialogScope) {
                        dialogScope.$destroy();
                        dialogScope = null;
                    }
                    // 删除对话框
                    if (dialogScope) {
                        dialogScope.remove();
                        dialogScope = _dialog.$element = null;
                    }
                }
                /**
                 * 绑定点击事件
                 */
                function bindBackdropEvents() {
                    if (options.backdrop) {
                        dialogElement.on('click', hideOnBackdropClick);
                        backdropElement.on('click', hideOnBackdropClick);
                        backdropElement.on('wheel', preventEventDefault);
                    }
                }
                /**
                 * 对话框绑定键盘事件
                 */
                function bindKeyboardEvents() {
                    if (options.keyboard) {
                        dialogElement.on('keyup', _dialog.$onKeyUp);
                    }
                }
                /**
                 * 绑定键盘事件 esc关闭对话框
                 */
                _dialog.$onKeyUp = function(evt) {
                    evt.stopPropagation();
                    if (evt.which === 27 && _dialog.isOpen) {
                        _dialog.close('esc');
                    }
                };
                /**
                 * 取消事件绑定
                 */
                function unbindBackdropEvents() {
                    if (options.backdrop) {
                        dialogElement.off('click', hideOnBackdropClick);
                        backdropElement.off('click', hideOnBackdropClick);
                        backdropElement.off('wheel', preventEventDefault);
                    }
                }
                
                function unbindKeyboardEvents() {
                    if (options.keyboard) {
                        dialogElement.off('keyup', _dialog.$onKeyUp);
                    }
                }
                
                /**
                 * 阻止默认事件
                 * @param {any} evt
                 */
                function preventEventDefault(evt) {
                    evt.preventDefault();
                }

                /**
                 * 对话框失去焦点
                 */
                _dialog.focus = function() {
                    dialogElement[0].focus();
                };

                /**
                 * 点击隐藏对话框遮罩
                 * @param {any} evt
                 * @returns
                 */
                function hideOnBackdropClick(evt) {
                    if (evt.target !== evt.currentTarget) return;
                    if (options.backdrop === 'static') {
                        _dialog.focus();
                    } else {
                        _dialog.close('backdrop');
                    }
                }
                return _dialog;
            }
            // 辅助功能
            function safeDigest(scope) {
                scope['$$phase'] || (scope.$root && scope.$root['$$phase']) || scope.$digest();
            }
            /**
             * 根据父级查找元素
             * @param {string} query
             * @param {string} element
             * @returns {array} elementLists
             */
            function findElement(query, element) {
                return angular.element((element || document).querySelectorAll(query));
            }

            function compile(options) {
                if (options.template && /\.html$/.test(options.template)) {
                    $log.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.');
                    options.templateUrl = options.template;
                    options.template = '';
                }
                var templateUrl = options.templateUrl;
                var template = options.template || '';
                var controller = options.controller;
                var controllerAs = options.controllerAs;
                var resolve = options.resolve || {};
                var locals = options.locals || {};
                var transformTemplate = options.transformTemplate || angular.identity;
                var bindToController = options.bindToController;
                angular.forEach(resolve, function(value, key) {
                    if (angular.isString(value)) {
                        resolve[key] = $injector.get(value);
                    } else {
                        resolve[key] = $injector.invoke(value);
                    }
                });
                angular.extend(resolve, locals);
                if (template) {
                    resolve.$template = $q.when(template);
                } else if (templateUrl) {
                    resolve.$template = fetchTemplate(templateUrl);
                } else {
                    throw new Error('Missing `template` / `templateUrl` option.');
                }
                if (options.titleTemplate) {
                    resolve.$template = $q.all([resolve.$template, fetchTemplate(options.titleTemplate)]).then(function(templates) {
                        var templateEl = angular.element(templates[0]);
                        findElement('[ng-bind="title"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
                        return templateEl[0].outerHTML;
                    });
                }
                if (options.contentTemplate) {
                    resolve.$template = $q.all([resolve.$template, fetchTemplate(options.contentTemplate)]).then(function(templates) {
                        var templateEl = angular.element(templates[0]);
                        var contentEl = findElement('[ng-bind="content"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
                        if (!options.templateUrl) contentEl.next().remove();
                        return templateEl[0].outerHTML;
                    });
                }
                return $q.all(resolve).then(function(locals) {
                    var template = transformTemplate(locals.$template);
                    if (options.html) {
                        template = template.replace(/ng-bind="/gi, 'ng-bind-html="');
                    }
                    var element = angular.element('<div>').html(template.trim()).contents();
                    var linkFn = $compile(element);
                    return {
                        locals: locals,
                        element: element,
                        link: function link(scope) {
                            locals.$scope = scope;
                            if (controller) {
                                var invokeCtrl = $controller(controller, locals, true, controllerAs);
                                if (controllerAs && bindToController) {
                                    angular.extend(invokeCtrl.instance, locals);
                                }
                                var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
                                element.data('$ngControllerController', ctrl);
                                element.children().data('$ngControllerController', ctrl);
                                if (controllerAs) {
                                    scope[controllerAs] = ctrl;
                                }
                            }
                            return linkFn.apply(null, arguments);
                        }
                    };
                });
            }
            var fetchPromises = {};
            function fetchTemplate(template) {
                if (fetchPromises[template]) return fetchPromises[template];
                return fetchPromises[template] = $http.get(template, {
                    cache: $templateCache
                }).then(function(res) {
                    return res.data;
                });
            }
            return DialogFactory;
        }
    }

    /** @ngInject */
    function simpleDialogController(dialogData) {
        var vm = this;
        vm.dialogData = dialogData;
    }

    /** @ngInject */
    function simpleDialogService($q, $timeout, $simpleDialog) {
        // 成功消息
        this.success = function(message, delay) {
            delay = delay || 1000;
            var dialog = $simpleDialog({
                animation: 'am-fade-and-scale',
                controller: 'simpleDialogController as dialog',
                size: "sm",
                placement: 'center',
                templateUrl: 'app/components/simpleDialog/simple-dialog-service.html',
                customClass: 'dialog-success',
                onClose: function(modei) {
                    $timeout.cancel(timeout);
                    modei.destroy();
                    dialog = null;
                },
                resolve: {
                    dialogData: function() {
                        return {
                            type: 'ok-circle',
                            title: "",
                            content: message
                        };
                    }
                }
            });
            dialog.$promise.then(dialog.open);
            var timeout = $timeout(function() {
                dialog.close();
            }, delay, false);
        };
        // 失败消息
        this.error = function(message, title) {
            var deferred = $q.defer();
            var dialog = $simpleDialog({
                animation: 'am-fade-and-scale',
                controller: 'simpleDialogController as dialog',
                customClass: 'dialog-error',
                size: "sm",
                placement: 'center',
                templateUrl: 'app/components/simpleDialog/simple-dialog-service.html',
                onClose: function(modei, source) {
                    deferred.resolve(source);
                    modei.destroy();
                    dialog = null;
                },
                resolve: {
                    dialogData: function() {
                        return {
                            type: 'remove-circle',
                            confirmButton: true,
                            title: title || "错误提醒",
                            content: message
                        };
                    }
                }
            });
            dialog.$promise.then(dialog.open);
            return deferred.promise;
        };
        // 警告消息
        this.warning = function(message, title) {
            var deferred = $q.defer();
            var dialog = $simpleDialog({
                animation: 'am-fade-and-scale',
                controller: 'simpleDialogController as dialog',
                customClass: 'dialog-warning',
                size: "sm",
                placement: 'center',
                templateUrl: 'app/components/simpleDialog/simple-dialog-service.html',
                onClose: function(modei, source) {
                    deferred.resolve(source);
                    modei.destroy();
                    dialog = null;
                },
                resolve: {
                    dialogData: function() {
                        return {
                            type: 'exclamation',
                            confirmButton: true,
                            title: title || "警告消息",
                            content: message
                        };
                    }
                }
            });
            dialog.$promise.then(dialog.open);
            return deferred.promise;
        };
        this.confirm = function(message, title) {
            var deferred = $q.defer();
            var dialog = $simpleDialog({
                animation: 'am-fade-and-scale',
                controller: 'simpleDialogController as dialog',
                customClass: 'dialog-confirm',
                html: true,
                size: "sm",
                backdrop: 'static', // 对话框遮罩
                keyboard: false, // 是否可以ESC关闭
                placement: 'center',
                templateUrl: 'app/components/simpleDialog/simple-dialog-service.html',
                onClose: function(modei, source) {
                    var isConfirm = source === "ok";
                    deferred.resolve(isConfirm);
                    modei.destroy();
                    dialog = null;
                },
                resolve: {
                    dialogData: function() {
                        return {
                            type: 'question',
                            confirmButton: true,
                            cancelButton: true,
                            title: title || "确认提醒",
                            content: message
                        };
                    }
                }
            });
            dialog.$promise.then(dialog.open);
            return deferred.promise;
        };
    }
})();