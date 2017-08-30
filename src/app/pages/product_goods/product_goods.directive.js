/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';
  angular
    .module('shopApp')
    .directive('adjustPricesDialog', adjustPricesDialog)
    .directive('productCategory', productCategory)
    .directive('productBrand', productBrand)
    .directive('addSkuvaluesDialog', addSkuvaluesDialog)
    .directive('productUnit', productUnit);


  /** @ngInject */
  function adjustPricesDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          childScope.item = angular.copy(scope.item);
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            scope.itemHandler({data: {"status":"0", "data": childScope.item}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_goods/product_goods_adjust_prices_dialog.html", handler, {
            windowClass: "viewFramework-adjust-prices-dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function productCategory(category) {
    var currentCategoryId; // 这也用来记录以及类目的id 在重选时使用
    var currentChildIndex; // 用来记录二级类目的id
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/product_goods/product_category.html",
      scope: {
        step: "=",
        handler: "&",
        cate: '=',
        isEdit: '=', // 判断是否是编辑模式 用于掩藏 '编辑' 2个字
        isReselect: '=' // 是否是重选
      },
      link: function(scope){

        scope.config = {};
        scope.pcateid = {};
        /*scope.isSelected = false; // 是否已经选择商品
        scope.isShowBtn = true; // 是否显示展示按钮
        scope.isShowItems = false; // 是否显示弹框*/
        if (scope.cate) { // 编辑商品
          scope.pcateid.parentCatename = scope.cate.catename;
          scope.pcateid.catename = scope.cate.items[0].catename;
          scope.currentIndex = scope.cate.id;
          currentCategoryId = scope.cate.id;
          scope.currentChildIndex = scope.cate.items[0].id;
          // scope.isShowBtn = false;
          // scope.isSelected = true;
        }



        category.goods().then(function (results) {
          scope.store = _.cloneDeep(results);
          console.log('999', scope.store);
          if (!scope.isReselect) { // 如果不是重选，则表示是第一次选择
            scope.currentIndex = scope.store[0].id; // 将当前类目设置为类目列表中的第一项
            scope.categoryItems = scope.store[0].items;
          } else { // 重选
            var index = _.findIndex(scope.store, function(cate) {
              return cate.id === currentCategoryId
            });
            scope.currentIndex = scope.store[index].id;
            scope.categoryItems = scope.store[index].items;
            scope.currentChildIndex = currentChildIndex;
          }

        });



        // 切换商品类目显示
        /*scope.config.toggleItems = function() {
          // scope.isShowItems = !scope.isShowItems;

          // 如果不是重选 则表示是第一次选择
          if (!scope.isReselect && scope.store) {
            scope.selectCategory(null, scope.store[0]);
          }
        };*/


        // 选择分类
        scope.selectCategory = function($event, cate) {
          console.log('333', cate);
          scope.categoryItems = cate.items;
          scope.currentIndex = cate.id;
        };

        // 选择子类目
        scope.select = function ($event, subItem) {
          // console.log('777', subItem);

          scope.currentChildIndex = subItem.id;
          scope.pcateid.parentid = subItem.parentid;
          scope.pcateid.catename = subItem.catename; // 二级类目的名称
          var parentCategory = _.filter(scope.store, function(cate) { // 找到二级类目所在的一级类目
            return cate.id === scope.pcateid.parentid
          });

          scope.pcateid.parentCatename = parentCategory[0].catename; // 一级类目的名称

          scope.pcateid.id = subItem.id;
          scope.pcateid.items = [subItem];

          currentCategoryId = subItem.parentid; // 选择项的一级类目的id
          currentChildIndex = subItem.id;       // 选择项的二级类目的id
          scope.isReselect = true;

          if (scope.cate) { // 编辑商品时使用
            scope.cate.catename = parentCategory[0].catename;
            scope.cate.items[0].catename = subItem.catename;
          }
          scope.step = 2; // 选择后将 步骤设置为 '2'

          if (scope.isReselect) {
            scope.handler({data: [scope.pcateid, scope.step, scope.isReselect]}); // 返回给控制器
          } else {
            scope.handler({data: [scope.pcateid, scope.step]}); // 返回给控制器
          }

          // scope.isShowBtn = false;
          // scope.isSelected = true;
          // scope.isShowItems = false;

        };

       /* // 重选
        scope.reselect = function() {

          // 重选前 先将tab 切换到 已选择项
          var index = _.findIndex(scope.store, function(cate) {
            return cate.id === scope.currentIndex;
          });
          scope.selectCategory(null, scope.store[index]);

          // scope.isShowItems = true;
          scope.isReselect = true;
        };


        // 关闭浮层
        scope.closeItems = function() {
          scope.isShowItems = false;

          if (scope.isReselect) { // 如果是重新选择,取消时将currentIndex还原
            scope.currentIndex = currentCategoryId;
          }
        };*/

      }
    }
  }

  /** @ngInject */
  function productBrand() {
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/product_goods/product_brand.html",
      scope: {
        store: "=",
        step: "=",
        isReselect: "=",
        brandname: "=",
        handler: "&"
      },
      link: function(scope){
        /**
         * 初始化数据
         * @type {{}}
         */
        // 需要提交的数据 brandname和brandid
        scope.brand = _.pick(scope.brandname, ['brandid', 'brandname']);

        if (scope.isReselect) { // 如果是重选类目 则清空商品品牌
          scope.brand.brandname = '';
        } else {
          console.log('8989', scope.brand);
        }

        // 选择展开状态
        scope.folded = false;
        scope.isFocused = false; // 是否点击了输入框
        // 生成初始化字母过滤
        scope.initials = [{text: '全部', active: true}];
        scope.initials = scope.initials.concat(_.map(_.times(26, {}), function (item) {
          return {text: String.fromCharCode(65 + item)};
        }));
        // 初始化过滤参数 cnname品牌名称 firstletter首字母
        scope.params = {
          cnname: "",
          firstletter: ""
        };
        // 直接选中品牌操作
        scope.select = function ($event, item) {
          scope.folded = false;
          setBrandListClass(item.id);
          scope.brand = {
            brandname: item.cnname,
            brandid: item.id
          };
          scope.handler({data: scope.brand});
        };
        // 手动输入操作
        scope.search = function () {
          scope.params = {
            cnname: scope.brand.brandname
          };
          _.forEach(scope.initials, function (key) {
            key.active = false;
          });
          scope.initials[0].active = true;
        };
        // 切换展开状态
        scope.toggle = function () {
          if (!scope.isFocused) {
            scope.isFocused = true;
          }
          setBrandListClass(scope.brand.brandid);
          if (scope.step !== 0) {
            console.log('555', scope.step);
            scope.folded = true;
          }
        };

        // 关闭
        scope.closeItems = function() {
          scope.folded = false;
        };


        /**
         * 输入时候，失去焦点
         */
        scope.getBrandname = function () {
          if(!_.isEmpty(scope.brand.brandname)){
            scope.toggle();
            scope.handler({data: scope.brand});
          }
        };

        /**
         * 点击字母筛选数据
         * @param $event
         * @param item
         */
        scope.filterIn = function ($event, item) {
          scope.params = {
            firstletter: item.text === "全部" ? "" : item.text
          };
          _.forEach(scope.initials, function (key) {
            key.active = key['$$hashKey'] === item['$$hashKey'];
          });
        };
        setBrandListClass(scope.brand.brandid);
        /**
         * 根据id设置高亮
         * @param id
         */
        function setBrandListClass(id){
          _.forEach(scope.store, function (item) {
            item.$active = item.id === id;
          });
        }
      }
    }
  }

  /** @ngInject */
  function productUnit() {
      return {
          restrict: 'A',
          templateUrl: 'app/pages/product_goods/product_unit.html',
          replace: true,
          scope: {
            store: '=',
            handler: '&'
          },
          link: function(scope) {
              // scope.isShow = false;
              // scope.isEdit = false; // 这个用于是否是手动的输入单位
              scope.units = _.map(['件', '桶', 'kg', 'g', 'm', '个', '套', '袋', '升', '台', '副', '片'], function (item) {
                  return {
                    text: item
                  };
              });
              // 如果scope.store一开始不存在则将 '件' 设置为默认单位，并添加样式
              if (_.isUndefined(scope.store)) {
                  scope.currentunit = '';

                // scope.units[0].active = true;
                // scope.currentunit = scope.units[0].text; // 默认为 '件'

              } else {
                scope.currentunit = scope.store;
                var index = _.findIndex(scope.units, function(unit) {
                  return unit.text === scope.store;
                });
                if (index > -1) {
                    scope.units[index].active = true;
                } else {
                    _.forEach(scope.units, function(unit) {
                      unit.active = false;
                    })
                }
              }

              scope.handler({data: scope.currentunit});
              // 选择单位
              scope.chooseUnit = function(unit) {
                _.forEach(scope.units, function (item) {
                    item.active = false;
                });

                unit.active = true;
                scope.currentunit = unit.text;
                scope.handler({data: scope.currentunit});
                // scope.isShow = false;
              };

              /*// 切换显示
                scope.toggleItems = function() {
                  scope.isShow = !scope.isShow;
                };

                scope.closeItems = function() {
                  scope.isShow = false;
                };
             */

              // 添加单位
              scope.addUnit = function(item) {
                // scope.isShow = true;
                var count = 0;
                _.forEach(scope.units, function(unit) {
                  if (unit.text === item) {
                    count++;
                    return;
                  }
                });

                /**
                 * 如果 count 为0 则表示输入框中的单位和默认单位库中不一致，则将所有active样式去掉
                 * 如果 count 不为0 则表示输入框中单位和默认单位库中的某个单位一致，然后找出索引添加active样式
                 */
                if (count === 0) {
                    _.forEach(scope.units, function(unit) {
                        unit.active = false;
                    });
                } else {
                  _.map(scope.units, function(unit) {
                      unit.active = false;
                  });
                  var index = _.findIndex(scope.units, function(unit) {
                    return unit.text === item;
                  });
                  scope.units[index].active = true;
                }
                scope.handler({data: item});
              }

          }

      }
  }

  /** @ngInject */
  function addSkuvaluesDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        store: "=",
        exist: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          childScope.message = false;
          /**
           * 获取当前索引sku信息
           * @type {*}
           */
          childScope.store =  _.chain(scope.store)
            .tap(function(array) {
              _.map(array, function(item){
                item.$select = undefined;
                item.$preValue = undefined;
                item.$items = angular.copy(item.items);
              });
            })
            .tap(function(array) {
              _.map(array, function(item){
                item.$items = angular.copy(item.items);
              });
            })
            /*.tap(function(array) {
              _.map(array, function(item){
                _.forEach(findExistData(item.id), function(items){
                  _.remove(item.$items, {'id': items.items[0].id});
                });
              });
            })*/
            .value();
          /*function findExistData(id){
            var items = [];
            _.forEach(scope.exist, function(item){
              _.find(item.skuvalues, {'id': id}) && items.push(_.find(item.skuvalues, {'id': id}));
            });
            return items;
          }*/

          /**
           * 选择一个value
           * @param data  选择的数据
           * @param item  父项
           */
          childScope.selectHandler = function (data, item) {
            item.$preValue = _.find(item.items, function (key) {
              return key.id == data;
            });
            childScope.message = false;
          };
          childScope.confirm = function () {
            var results = getData();
            if(childScope.store.length && !results.length){
              childScope.message = true;
              return ;
            }
            scope.itemHandler({data: {"status":"0", "data": results}});
            childScope.close();
          };

          /**
           * 获取提交的数据
           */
          function getData(){
            var results = [];
            _.forEach(childScope.store, function(item){
              item.$preValue && item.$items.length && results.push({
                id: item.id,
                skuname: item.skuname,
                skutype: item.skutype,
                sort: item.sort,
                items: [item.$preValue]
              });
            });
            return results;
          }

        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_goods/product_goods_add_skuvalues_dialog.html", handler, {
            windowClass: "viewFramework-add-skuvalues-dialog"
          });
        })
      }
    }
  }


})();

