/**
 * simpleDragdrop是一个通用的拖拽组件
 *
 * config    全局配置参数
 *    checkboxLabel           显示的文字
 *    checkboxChecked         指定当前是否选中   默认值 false
 *    checkboxDisabled        指定当前是否禁用   默认值 false
 *    checkboxIndeterminate   指定当前是否关联一组多选框是否有选中   默认值 false
 *    onChange                选项变化时的回调函数  返回当前的是否选中
 *
 * simpleCheckboxGroup是一个通用的一组多选框组件
 *
 * config    全局配置参数
 *    checkboxValue      根据 value 进行比较，判断是否选中    选中的value数组 默认[]
 *    onChange           选项变化时的回调函数
 *    options            以配置形式设置子元素
 *       label              显示的文字        必填
 *       value              提交给后台的字段   必填
 *       disabled           是否禁用          默认值 false
 *       checked            指定当前是否选中   默认值 false
 */

(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('simpleDragdrop', simpleDragdrop)
        .directive('simpleDragdropTable', simpleDragdropTable);

    /**
     * /**
     * 碰撞检测
     * @param collided 被碰撞者
     * @param detectors 碰撞者
     * @returns {boolean}
     */
    function collisionDetection(collided, detectors) {
        var collidedClientRect = collided[0].getBoundingClientRect();
        var detectorsClientRect = detectors[0].getBoundingClientRect();
        var t1 = collidedClientRect.top;
        var l1 = collidedClientRect.left;
        var r1 = collidedClientRect.right;
        var b1 = collidedClientRect.bottom;
        var t2 = detectorsClientRect.top;
        var l2 = detectorsClientRect.left;
        var r2 = detectorsClientRect.right;
        var b2 = detectorsClientRect.bottom;
        return !(b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2);
    }

    //计算一个元素和多个元素中直线距离最短的是谁
    function getShortObj(obj, arr) {
        var o = null;
        var pos = 100000;
        console.log('getShortObj', obj, arr)

        for (var i=0; i<arr.length; i++) {
            var a = (obj.offset().top + obj.height() / 2) - (arr[i].offset().top + arr[i].height() / 2);
            var b = (obj.offset().left + obj.width() / 2) - (arr[i].offset().left + arr[i].width() / 2);
            var c = Math.sqrt(a*a + b*b);

            if (c < pos) {
                pos = c;
                o = arr[i];
            }
        }
        return o;
    }


    /**
     * 数组元素交换位置
     * @param {array} arr 数组
     * @param {number} index1 添加项目的位置
     * @param {number} index2 删除项目的位置
     * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
     */
    function swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    }


    /** @ngInject */
    function simpleDragdrop($window, $document) {
        return {
            restrict: "A",
            scope: {
                dragdropOptions: "=",
                onStart: "&",
                onStop: "&",
                onDrag: "&"
            },
            link: function (scope, iElement, iAttrs) {
                var element = angular.element;
                // 获取body
                var bodyElement = element($window.document.body);
                var deepCopy = iAttrs.deepCopy === 'true';
                var dragElement = null;
                var cursorInit = iElement.css('cursor');
                iElement.on('mouseenter', function () {

                }).on('mouseleave', function () {

                });
                var o = null;
                // 鼠标移动位置
                var move = {
                    x: 0,
                    y: 0
                };
                var offset = null;
                iElement.on('mousedown.simpleDragdrop', function (event) {
                    iElement.css({'cursor': 'move'});
                    var dragdropList = element(iElement).parent().children();
                    if (deepCopy && dragElement === null) {
                        offset = element(iElement).offset();
                        // 拷贝要拖拽的元素
                        dragElement = element(iElement).clone();
                        dragElement.css(offset);
                        //
                        dragElement.css({'position': 'absolute'});
                        dragElement.css({'cursor': 'move'});
                        bodyElement.append(dragElement);
                    }
                    iElement.addClass('simple-dragdrop-element');
                    move.x = event.clientX - offset.left;
                    move.y = event.clientY - offset.top;
                    scope.onStart({data: move});
                    $document.on('mousemove.simpleDragdrop', function (event) {
                        var drag = {
                            left: event.clientX - move.x,
                            top: event.clientY - move.y
                        };

                        // 因为在碰撞的时候，也许会碰上多个元素，所以我们需要在for循环以后，才能去判断哪个被碰撞上的元素才是我们想要的，
                        // 所有在这里，我们用一个数组去存碰上的元素
                        var pzArr = [];
                        dragElement.css({'cursor': 'move'});
                        dragElement.css(drag);
                        //碰撞检测
                        dragdropList.each(function (index, ele) {
                            if (element(ele).attr('simple-dragdrop') !== dragElement.attr('simple-dragdrop')) {
                                collisionDetection(element(ele), dragElement) && pzArr.push(element(ele));
                            }
                        });
                        console.log(pzArr);

                        //如果有多个被碰撞的元素，那么就要确定一下哪个元素才是我们想要的
                        //把当前拖拽的元素和碰碰撞上的元素做一个中间点直线距离检测，距离最短，才是我们要的元素
                        o = getShortObj(dragElement, pzArr);
                        dragdropList.removeClass('simple-dragdrop-dashed');
                        if (o) {
                            o.addClass('simple-dragdrop-dashed');
                        }
                        scope.onDrag({data: drag});
                    });
                    $document.on('mouseup.simpleDragdrop', function (event) {
                        element(this).off("mousemove.simpleDragdrop");
                        element(this).off("mouseup.simpleDragdrop");
                        var newIndex = dragElement.attr('simple-dragdrop');
                        var oldIndex = dragElement.attr('simple-dragdrop');
                        if (o) {
                            offset = o.offset();
                            o.removeClass('simple-dragdrop-dashed');
                            newIndex = o.attr('simple-dragdrop');
                        }
/*                        dragElement.animate(offset, "slow", "swing", function () {
                            dragElement.remove();
                            dragElement = null;
                            iElement.removeClass('simple-dragdrop-dashed');
                            iElement.removeClass('simple-dragdrop-element');
                            if(oldIndex === newIndex){
                                return ;
                            }
                            console.log('simple-dragdrop', swapArray(scope.dragdropOptions, oldIndex, newIndex));

                            scope.$apply(function () {
                                scope.onStop({data: scope.dragdropOptions});
                            });
                        });*/

                        dragElement.css(offset);
                        dragElement.remove();
                        dragElement = null;
                        iElement.removeClass('simple-dragdrop-dashed');
                        iElement.removeClass('simple-dragdrop-element');
                        iElement.css({'cursor': cursorInit});
                        if(oldIndex === newIndex){
                            return ;
                        }
                        console.log('simple-dragdrop', swapArray(scope.dragdropOptions, oldIndex, newIndex));
                        scope.$apply(function () {
                            scope.onStop({data: scope.dragdropOptions});
                        });
                    });
                    return false;
                });

            }
        }
    }

    /** @ngInject */
    function simpleDragdropTable($window) {
        // 获取body
        var bodyElement = angular.element($window.document.body);
        return {
            restrict: "A",
            scope: {
                onStart: "&",
                onStop: "&",
                onDrag: "&"
            },
            link: function (scope, iElement, iAttrs) {
                var mode = iAttrs.mode || 'row';
                console.log(iElement)
                iElement.on('mousedown.simpleDragdrop', function (event) {
                    bodyElement.append(cloneTable(iElement, mode))
                });

            }
        }
    }

    /**
     * 克隆表格
     * @param iElement
     * @param mode     column | row
     */
    function cloneTable(iElement, mode){

        var oUl = angular.element('<ul class="simple-table"></ul>');
        oUl.css({
            width: iElement.width(),
            left: iElement.offset().left,
            top: iElement.offset().top,
            position: 'absolute',
            'zindex': '100'
        });

         _.reduce(buildTables(iElement, mode), function(previous, current) {
                var li = angular.element('<li></li>');
                li.html(current);
            return previous.append(li) && previous;
        }, oUl);
        return oUl;
    }

    function buildTables (table, mode) {
        return mode === 'column' ? buildColumnTables(table) : buildRowTables(table);
    }


    function buildColumnTables(table) {
        return _.map(_.toArray(getLongestRow(table).children), function (item, index) {
            return getColumnAsTableByIndex(table, index);
        });
    }

    function getLongestRow(table){
        var result = table[0].rows[0];
        angular.element(table[0].rows).each(function (index, ele) {
            var rowL = ele.children.length;
            var resultL = result.children.length;
            result = rowL > resultL ? ele : result;
        });
        return result;
    }

    function getColumnAsTableByIndex(table, index) {
        console.log(table, index)
        
    }
    /*function getColumnAsTableByIndex (table, index) {
        const cTable = table.cloneNode(true);
        origin2DragItem(cTable);

        const cols = cTable.querySelectorAll('col');
        if (cols.length) {
            Array.from(cols).forEach((col, dex) => {
                if (dex !== index) {
                col.parentElement.removeChild(col);
            }
        });
        }

        Array.from(cTable.rows).forEach((row) => {
            const target = row.children[index];
        empty(row);
        if (target) {
            row.appendChild(target);
        }
    });
        return cTable;
    }*/

    function buildRowTables(table) {
        return _.map(_.toArray(table[0].rows), function (row) {
            var  cTable = angular.element(table).clone(true);
            origin2DragItem (cTable);
            _.forEach(_.toArray(cTable.children()), function (node) {
                var nodeName = node.nodeName;
                if (nodeName !== 'COL' && nodeName !== 'COLGROUP') {
                    node.remove();
                }
            });
            var  organ = angular.element(angular.element(row).parent()).clone();
            organ.html('');
            organ.append(angular.element(row).clone(true));
            cTable.append(organ);
            console.log(angular.element(cTable).find('thead').find('th'))
            return cTable;
        });
    }

    function origin2DragItem (liTable) {
        liTable.css({ 'table-layout': 'fixed', width: '100%', height: 'initial', padding: 0, margin: 0 });
        ['width', 'height', 'id'].forEach(function(attr){
            liTable.removeAttr(attr);
        });
        _.forEach(_.toArray(liTable.find('col')), function (col) {
            col.removeAttr('width');
            col.width('initial');
        });
    }


    /*  originTable: 'sindu_origin_table',
        draggableTable: 'sindu_dragger',
        dragging: 'sindu_dragging',
        static: 'sindu_static',
        handle: 'sindu_handle', */
})();