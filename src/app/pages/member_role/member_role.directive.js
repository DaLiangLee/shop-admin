/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive('memberRoleDialog', memberRoleDialog);

    /** @ngInject */
    function memberRoleDialog($log, cbDialog, configuration, cbAlert, treeService, memberRole){
        function getData(data){
            if(!data){
                return ;
            }
            var array = [];
            var results = data.concat([]);
            /**
             * 设置父节点的checked选中状态
             * @param item
             * @param childrenName
             * @param parent
             */
            var enhanceItem = function(item, childrenName){
                var hasCheckedNode = function (node) {
                    return _.find(node.$allChildren(), function(subNode) {
                        return subNode.$checked;
                    });
                };
                var updateAncestorsState = function(node) {
                    var parent = node.$parent;
                    while(parent) {
                        // 只有选中的子节点，没有未选中的子节点时，当前节点才设置为选中状态
                        parent.$checked = angular.isDefined(hasCheckedNode(parent));
                        parent = parent.$parent;
                    }
                };
                updateAncestorsState(item);
                /**
                 * 循环递归查询子项
                 */
                angular.forEach(item.$children(), function (subItem) {
                    enhanceItem(subItem, childrenName, item);
                });
            };
            /**
             * 循环操作
             */
            angular.forEach(results, function (item) {
                enhanceItem(item, 'items');
            });

            /**
             * 删除未选中的项目
             * @param item
             * @param childrenName
             * @param parent
             */
            var removeItem = function(item, childrenName, parent) {
                var subItems = item[childrenName] || [];
                /**
                 * 删除未选中的
                 */
                _.remove(parent, function (item) {
                    return !item.$checked;
                });
                angular.forEach(subItems, function (subItem) {
                    removeItem(subItem, childrenName, subItems);
                });

            };

            /**
             * 循环操作
             */
            angular.forEach(results, function (item) {
                removeItem(item, "items", results);
            });

            /**
             * 添加操作
             * @param item
             * @param childrenName
             */
            var pushItem = function (item, childrenName) {
                var subItems = item[childrenName] || [];
                item.$checked && array.push(item.id);
                angular.forEach(subItems, function (subItem) {
                    pushItem(subItem, childrenName);
                });
            };
            angular.forEach(results, function (item) {
                pushItem(item, "items");
            });
            return array;
        }

        /**
         * 生成树形菜单数据
         * @param arr
         * @returns {Array}
         */
        function generatedTreeData(arr, notItem){
            if(notItem){
                return [arr];
            }
            /**
             * 过滤不显示的项
             */
            _.remove(arr.items, function (item) {
                return item.display == "0";
            });
            angular.forEach(arr.items, function(k){  // 2
                /**
                 * 过滤不显示的项
                 */
                _.remove(k.items, function (item) {
                    return item.display == "0";
                });
                angular.forEach(k.items, function(m){ // 3
                    m.items = undefined;
                });
            });

            return [arr];
        }

        /**
         * 递归编辑子项目
         * @param arr
         * @param data
         * @returns {*}
         */
        var editorItems = function(item, childrenName, roleList){
            if(!roleList.length){
                return ;
            }
            var index = _.findIndex(roleList, {id: item.id});
            if(index > -1){
                item.$checked = true;
            }else{
                return ;
            }
            /**
             * 循环递归查询子项
             */
            var subItems = item[childrenName] || [];
            var subRoleList = roleList[index][childrenName] || [];
            angular.forEach(subItems, function (subItem) {
                editorItems(subItem, childrenName, subRoleList);
            });
        };
        /**
         * 检查所有子项目有没有勾选
         * @param arr
         * @param data
         * @returns {*}
         */
        var checkedItem = function(item, childrenName){
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
                    // 同时有选中的子节点和未选中的子节点时视为待定状态
                    parent.$indeterminate = hasCheckedNode(parent) && hasUncheckedNode(parent);
                    parent = parent.$parent;
                }
            };
            updateAncestorsState(item);
            /**
             * 循环递归查询子项
             */
            angular.forEach(item.$children(), function (subItem) {
                checkedItem(subItem, childrenName, item);
            });
        };
        /**
         * 循环操作
         */

        /**
         * 设置编辑菜单数据
         * @param arr
         * @param data
         * @returns {*}
         */
        /*function generatedEditorData(arr, data){
            var data = [{
                "id": 1,
                "menuname": "全部菜单",
                "category": "all",
                "items": data,
                "parentid": 0
            }];
            var results = arr.concat([]);
            angular.forEach(results, function(item){
                editorItems(item, "items", data);
            });
            angular.forEach(results, function (item) {
                checkedItem(item, 'items');
            });
            return results;
        }*/

        /**
         * 获取编辑数组
         * @param data
         */
        function getEditorData(data, childrenName) {
            if(!data.length){
              return [];
            }
            childrenName = childrenName || "items";
            var results = [1];
            _.forEach(data, function (item) {
              results.push(item.id*1);
              item[childrenName] && _.forEach(item[childrenName], function (subItem) {
                results.push(subItem.id*1);
              });
            });
            return _.uniq(results, true);
        }
        return {
            restrict: "A",
            scope: {
                item: "=",
                roleItem: "&"
            },
            link: function(scope, iElement, iAttrs){
                var iEle = angular.element(iElement),
                    type = iAttrs.memberRoleDialog,
                    transmit = [],
                    roleList  = angular.copy(configuration.getMenu()),
                    copyDiff = [1, 10, 100200];

                /**
                 * 弹窗处理事件
                 */
                function handler(childScope) {
                    childScope.item = angular.extend({}, scope.item);
                    angular.isUndefined(childScope.item.datascope) && (childScope.item.datascope = "0");
                    childScope.alertWarning = "";
                    childScope.interceptor = false;


                    childScope.item.items = generatedTreeData(roleList);
                    treeService.enhance(childScope.item.items, 'items');
                    treeService.setCheckState(childScope.item.items, copyDiff, "id");

                    childScope.title = iAttrs.title;
                    childScope.confirm = function () {
                        /**
                         * 拷贝数据，不然会修改页面数据
                         */
                        transmit = angular.copy(childScope.item);
                        if(!transmit.rolename){
                            childScope.alertWarning = '需要填写角色名字';
                            return ;
                        }
                        /*if(!transmit.datascope){
                            childScope.alertWarning = '需要选择角色范围';
                            return ;
                        }*/
                        $log.debug(transmit.items);
                        /**
                         * 获取提交数据
                         */
                        transmit.items = getData(transmit.items);

                        //console.log(data.items)
                        if(!transmit.items.length){
                            childScope.alertWarning = '至少要选择一个权限项目';
                            return ;
                        }
                        if(type === 'add'){
                            confirm();
                        }
                        /**
                         * 如果是编辑就给拦截提示，防止误操作
                         */
                        if(type === 'edit'){
                            if(angular.isDefined(scope.item)){
                                if(angular.equals(transmit.items, copyDiff) && transmit.rolename === scope.item.rolename && transmit.datascope === scope.item.datascope){
                                    childScope.alertWarning = '没有修改权限项目';
                                    return ;
                                }
                            }
                            childScope.interceptor = true;
                        }
                    };
                    childScope.interceptorConfirm = function () {
                        confirm();
                    };
                    function confirm(){
                        /**
                         * 如果没有修改设置权限菜单
                         * 就返回给后台一个空数组，减少后端的查询次数
                         */
                        childScope.alertWarning = "";
                        childScope.close();
                        /**
                         * 提交数据
                         */
                        memberRole[type](transmit).then(function (data) {
                            scope.roleItem({data: {"status": 0, "data": data.data}});
                        });
                    }
                }

                /**
                 * 点击按钮
                 */
                iEle.click(function (t) {
                    scope.roleItem({data: {"status": -1, "data":"打开成功"}});
                    t.preventDefault();
                    t.stopPropagation();
                    if(type === 'edit'){
                      memberRole.get({roleid: scope.item.id}).then(function(results){
                        if (results.data.status == 0) {
                          copyDiff = getEditorData(results.data.data);
                          cbDialog.showDialogByUrl("app/pages/member_role/member_role_dialog.html", handler, {
                            windowClass: "viewFramework-member-role-dialog"
                          });
                        } else {
                          cbAlert.error("错误提示", results.data.data);
                        }
                      });
                    }else{
                      cbDialog.showDialogByUrl("app/pages/member_role/member_role_dialog.html", handler, {
                        windowClass: "viewFramework-member-role-dialog"
                      });
                    }
                })
            }
        }
    }


})();
