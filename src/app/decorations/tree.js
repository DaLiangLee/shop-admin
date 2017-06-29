/**
 * Created by Administrator on 2016/10/18.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .service('treeService', treeService)
        .filter('treeFilter', treeFilter)
        .directive('bfCheckIndeterminate', bfCheckIndeterminate)
        .directive('bfTemplate', bfTemplate)
        .directive('bfRecurse', bfRecurse);

    /** @ngInject */
    function treeService(){
        var _this = this;
        var enhanceItem = function (item, childrenName, parent) {
            if (parent) {
                item.$parent = parent;
                item.$siblings = function () {
                  if(!angular.isArray(item.$parent.items)){
                    return [];
                  }
                  return _.filter(item.$parent.items, function (key) {
                    return key['$$hashKey'] !== item['$$hashKey'];
                  });
                };
            }
            item.$hasChildren = function () {
                var subItems = this.$children();
                return angular.isArray(subItems) && subItems.length;
            };

            item.$children = function () {
                return this[childrenName] || [];
            };
            var getFlattenData = function (items) {
                var result = items || [];
                angular.forEach(items, function (item) {
                    result = result.concat(getFlattenData(item.items));
                });
                return result;
            };

            item.$allChildren = function() {
                return getFlattenData(this.$children());
            };

            item.$foldToggle = function () {
                this.$folded = !this.$folded;
            };
            item.$isFolded = function () {
                return this.$folded;
            };
            var hasCheckedNode = function (node) {
                return _.find(node.$allChildren(), function(subNode) {
                    return subNode.$checked;
                });
            };
            var hasUncheckedNode = function (node) {
                return _.find(node.$allChildren(), function(subNode) {
                    return !subNode.$checked;
                });
            };
            var updateAncestorsState = function(node) {
                var parent = node.$parent;
                while(parent) {
                    // 只有选中的子节点，没有未选中的子节点时，当前节点才设置为选中状态
                    parent.$checked = hasCheckedNode(parent) && !hasUncheckedNode(parent);
                    // 同时有选中的子节点和未选中的子节点时视为待定状态 （会让没有全选的父级多一个横杠）
                    parent.$indeterminate = hasCheckedNode(parent) && hasUncheckedNode(parent);
                    parent = parent.$parent;
                }
            };
            var setCheckState = function (node, checked) {
                node.$checked = checked;
                if (node.$hasChildren()) {
                    angular.forEach(node.$children(), function (subNode) {
                        setCheckState(subNode, checked);
                    });
                }
                updateAncestorsState(node);
            };
            item.$check = function () {
                setCheckState(this, true);
            };
            item.$unCheck = function () {
                setCheckState(this, false);
            };
            item.$setCheckState = function(checked) {
                _this.checkStateChange(this, checked);
                setCheckState(this, checked)
            };
            item.$isChecked = function () {
                return this.$checked;
            };
            item.$checkToggle = function () {
                if (this.$isChecked()) {
                    this.$unCheck();
                } else {
                    this.$check();
                }
            };
            item.$isIndeterminate = function () {
                return this.$indeterminate;
            };
            angular.forEach(item.$children(), function (subItem) {
                enhanceItem(subItem, childrenName, item);
            });
        };
        /**
         * 暴露选择状态改变的接口
         */
        this.checkStateChange = function(){};
        /**
         * 初始化树形菜单
         * @param items
         * @param childrenName
         * @returns {*}
         */
        this.enhance = function (items, childrenName) {
            if (angular.isUndefined(childrenName)) {
                childrenName = 'items';
            }
            angular.forEach(items, function (item) {
                enhanceItem(item, childrenName);
            });
            return items;
        };

        /**
         * 设置选中状态递归操作
         * @param item
         * @param findItems
         * @param findName
         */
        var setCheckItem = function (item, findItems, findName) {
            item.$setCheckState(_.indexOf(findItems, item[findName]) >= 0);
            angular.forEach(item.$children(), function (subItem) {
                setCheckItem(subItem, findItems, findName);
            });
        };
        /**
         * 初始化设置选中状态
         * @param items    树形菜单
         * @param findItems    设置的数组 默认[]
         * @param findName    查找的字段 默认id
         */
        this.setCheckState = function (items, findItems, findName) {
            findItems = findItems || [];
            findName = findName || "id";
            if(!findItems.length){
                return ;
            }
            angular.forEach(items, function (item) {
                setCheckItem(item, findItems, findName);
            });
        };
        /**
         * 获取选中状态的结果
         * @param items   树形菜单
         * @param type    id或者item 默认id
         * @param form    linear或者tree  默认linear
         */
        /*this.getCheckState = function (items, type, form) {

        }*/
    }
    /** @ngInject */
    function treeFilter(treeService) {
        return function(items, childrenName) {
            treeService.enhance(items, childrenName);
            return items;
        }
    }
    /** @ngInject */
    function bfCheckIndeterminate() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                scope.$watch(
                    function () {
                        return scope.$eval(attrs.bfCheckIndeterminate);
                    },
                    function (value) {
                        angular.forEach(element, function (DOM) {
                            DOM.indeterminate = value;
                        });

                    }
                );
            }
        };
    }
    /** @ngInject */
    function bfTemplate() {
        return {
            restrict: "A",
            priority: 2000,
            compile: function (element) {
                var template = element[0].outerHTML;
                return function (scope, element, attrs) {
                    scope.$template = template;
                    if (!scope.$dataSource) {
                        scope.$dataSource = scope.$eval(attrs.bfTemplate);
                    }
                }
            }
        }
    }
    /** @ngInject */
    function bfRecurse($compile) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                // 建立一个独立作用域
                var subScope = scope.$new(true);
                // 取得本节点的数据，这个数据将被传给模板
                subScope.$dataSource = scope.$eval(attrs.bfRecurse);
                // 生成live DOM
                var dom = $compile(scope.$template)(subScope);
                element.replaceWith(dom);
            }
        }
    }

})();
