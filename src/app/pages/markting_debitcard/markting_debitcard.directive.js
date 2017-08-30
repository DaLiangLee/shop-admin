/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('settingDebitcardDialog', settingDebitcardDialog);

  /** @ngInject */
  function settingDebitcardDialog(cbDialog, configuration, shophomeService) {
    var DEfAULT_COVERS = [
      {
        sClass: 'cover1',
        active: false,
        cover: "/public/debitcard/01.png"
      },
      {
        sClass: 'cover2',
        active: false,
        cover: "/public/debitcard/02.png"
      },
      {
        sClass: 'cover3',
        active: false,
        cover: "/public/debitcard/03.png"
      },
      {
        sClass: 'cover4',
        active: false,
        cover: "/public/debitcard/04.png"
      },
      {
        sClass: 'cover5',
        active: false,
        cover: "/public/debitcard/05.png"
      }
    ];
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement, iAttrs) {
        function handler(childScope) {
          childScope.isReadonly = iAttrs.settingDebitcardDialog === 'edit';
          childScope.dataBase = {};
          childScope.covers = DEfAULT_COVERS;
          shophomeService.getInfo().then(function (results) {
            childScope.manager = results.data.store.storename;
          });

          childScope.checkRechargeamount = function (item) {
            if ((item.giveamount - item.rechargeamount) > 0) {
              item.isPrevent = true;
            } else {
              item.isPrevent = false;
            }
          };

          _.map(childScope.covers, function (key) {
            key.images = configuration.getStatic() + key.cover;
          });

          if (_.isUndefined(scope.item)) {
            childScope.dataBase = {
              status: 1
            };
            setActive(0);
          } else {
            childScope.dataBase = _.pick(scope.item, ['guid', 'name', 'rechargeamount', 'giveamount', 'quantity', 'background', 'status']);
            var index = _.findIndex(childScope.covers, function (key) {
              return key.cover === childScope.dataBase.background;
            });
            index === -1 ? setActive(0) : setActive(index);
            index = null;
          }

          /**
           * 设置背景选择按钮当前状态
           * @param i
           */
          function setActive(i) {
            _.map(childScope.covers, function (key) {
              key.active = false;
            });
            childScope.covers[i].active = true;
            setCover(childScope.covers[i].cover);
          }

          childScope.select = function ($event, item) {
            _.map(childScope.covers, function (key) {
              key.active = false;
            });
            item.active = true;
            setCover(item.cover);
          };

          /**
           * 设置储值卡背景
           * @param cover
           */
          function setCover(cover) {
            childScope.dataBase.cover = configuration.getStatic() + cover;
            childScope.dataBase.background = cover;
          }

          childScope.confirm = function () {
            scope.itemHandler({data: {"status": "0", "data": _.omit(childScope.dataBase, ['cover'])}});
            childScope.close();
          };

          childScope.interceptorConfirm = function () {
            scope.itemHandler({data: {"status": "0", "data": _.pick(childScope.dataBase, ['cover'])}});
            childScope.close();
          };
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/markting_debitcard/setting_debitcard_dialog.html", handler, {
            windowClass: "viewFramework-setting-debitcard-dialog"
          });
          /*shopHome.manager().then(function (results) {
            if (results.data.status == '0') {
              manager = results.data.data;
              cbDialog.showDialogByUrl("app/pages/markting_debitcard/setting_debitcard_dialog.html", handler, {
                windowClass: "viewFramework-setting-debitcard-dialog"
              });
            } else {
              cbAlert.error(results.data.data);
            }
          });*/
        });
      }
    }
  }
})();
