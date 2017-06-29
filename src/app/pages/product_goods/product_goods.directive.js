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
  function productCategory($window, $timeout, category, cbAlert) {
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/product_goods/product_category.html",
      scope: {
        step: "=",
        handler: "&"
      },
      link: function(scope, iElement){
        category.goods().then(function (results) {
          scope.store = _.cloneDeep(results);
          $timeout(function(){
            minHeight = iElement.find('.list .tags .u-item').outerHeight(true);
            getMore(minHeight);
          },0);
        });
        var minHeight;
        var tagsHeight;
        scope.pcateid = {};
        scope.select = function ($event, subItem, item) {
          resetActive();
          subItem.$active = true;
          scope.pcateid = _.omit(item, 'items');
          scope.pcateid.items = [subItem];
          scope.toggle();
        };
        scope.folded = false;
        scope.toggle = function (flag) {
          if(flag === false){
            scope.handler({data: 'rollback'});
            scope.folded = !scope.folded;
            return false;
          }
          if(scope.step > 1 && flag){
            cbAlert.confirm("编辑类目类型", function (isConfirm) {
              if (isConfirm) {
                scope.folded = !scope.folded;
                scope.handler({data: 'reset'});
              }
              cbAlert.close();
            }, "如果修改以后的品牌将被清空，是否继续？", "warning");
          }else{
            scope.folded = !scope.folded;
            scope.handler({data: scope.pcateid});
          }
        };

        scope.$watch('step', function (value) {
          if(value === 0){
            scope.pcateid = {};
            scope.folded = false;
            resetActive();
          }
        });
        angular.element($window).on('resize', function () {
          getMore(minHeight);
        });

        function getMore(minHeight){
          iElement.find('.list').each(function (iIndex, oElement) {
            var list = angular.element(oElement);
            list.find('.more').removeClass('flag');
            list.find('.tags').css('height', 'auto');
            if(list.find('.tags').height() > minHeight){
              list.find('.tags').data('actual-height', list.find('.tags').height()).height(minHeight);
              list.find('.more').removeClass('f-hide');
            }else{
              list.find('.more').addClass('f-hide');
            }
          });
        }

        iElement.on('click', '.more', function () {
          var tags = angular.element(this).siblings('.tags');
          if (_.isUndefined(tags.data('actual-height'))) {
            tagsHeight =  tags.data('actual-height', tags.height());
            getMore(minHeight);
          } else {
            tagsHeight = tags.data('actual-height');
          }

          // var tagsHeight = tags.data('actual-height') || tags.data('actual-height', tags.height());
          // var tagsHeight = tags.data(tags.data('actual-height'));
          var flag = tags.height() === minHeight;
          var height = flag ? tagsHeight : minHeight;
          tags.height(height);
          angular.element(this).toggleClass('flag');
        });


        /**
         * 重置高亮
         */
        function resetActive() {
          _.forEach(scope.store, function (item) {
            item.items.length && _.forEach(item.items, function (subItem) {
              subItem.$active = false;
            });
          });
        }
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

        // 选择展开状态
        scope.folded = false;
        // 生成初始化字母过滤
        scope.initials = [{text: '全部品牌', active: true}];
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
          scope.toggle();
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
          setBrandListClass(scope.brand.brandid);
          scope.folded = !scope.folded;
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
            firstletter: item.text === "全部品牌" ? "" : item.text
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
                scope.units = _.map(['件', '桶', 'kg', 'g', 'm', '个', '套', '袋', '升', '台', '副', '片'], function (item) {
                    return {
                      text: item
                    };
                });
                // 如果scope.store一开始不存在则将 '件' 设置为默认单位，并添加样式
                if (_.isUndefined(scope.store)) {
                    scope.units[0].active = true;
                    scope.currentunit = scope.units[0].text;
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
                };

                // 添加单位
                scope.addUnit = function(item) {
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
                      })
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

