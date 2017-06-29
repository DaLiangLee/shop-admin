(function (angular) {
  angular.module("shopApp")
    .directive("userPackageDialog", userPackageDialog);

  /** @ngInject */
  function userPackageDialog(cbDialog, utils) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          var expireDay = 0;
          childScope.item = scope.item;
          childScope.config = {
            changetime: function () {
              var time = parseInt(this.time, 10);
              if(isNaN(time)){
                time = 0;
              }
              expireDay  = childScope.item.$expireDay + time - 1;
              this.extendDate = utils.getFutureTime(expireDay);
            }
          };
          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.itemHandler({
              data: {
                "status": "0",
                "data": {
                  time: childScope.config.time,
                  expireDay: expireDay === 0 ? 1 : expireDay,
                  expire: childScope.config.extendDate
                }
              }
            });
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
          cbDialog.showDialogByUrl("app/pages/user_package/package_dialog.html", handler, {
            windowClass: "viewFramework-user-package-dialog"
          });

        })
      }
    }
  }


/*  function packageDialog() {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: '',
      scope: {
        extendDate: '@',
        extendTime: '@',
        hideDialog: '&',
        changeData:'&'
      },
      controller: ["$scope", "$state", "utils", "marktingPackage", "cbAlert", function ($scope, $state, utils, marktingPackage, cbAlert) {
        $scope.config = {
          time: "",
          hasChanged: true,
          expirationTime: "",
          inputCheck:true,
          dataStore: {
            extendDate: $scope.extendDate,
            extendTime: $scope.extendTime
          },
          changetime: function () {
            var reg = /^[1-9]\d*$/;
            this.inputCheck = reg.test(this.time);
            if (_.isUndefined(this.time)) {
              $scope.extendTime = parseInt(this.dataStore.extendTime, 10) + "天";
              // $scope.extendDate = utils.getFutureTime(this.dataStore.extendDate, "0");
              $scope.extendDate = utils.getFutureTime("0");
            } else {
              $scope.extendTime = parseInt(this.dataStore.extendTime, 10) + this.time * 1 + "天";
              $scope.extendDate = utils.getFutureTime(this.time);
            }

          },
          sendData: function () {
            marktingPackage.incexpire({id: $state.params.userpackageid, expireDay: this.time}).then(function (results) {
              var result = results.data;
              if (result.status * 1 === 0) {
                /!*如果延长操作成功，关闭弹窗并刷新页面*!/
                $scope.changeData({
                  data:{
                    extendDate:$scope.extendDate,
                    timeLeft:$scope.extendTime
                }});
                $scope.hideDialog();
                cbAlert.success("延长成功", result.data);
              } else {
                cbAlert.error("错误提示", result.data);
              }
            })
          }
        };


      }],
      controllerAs:'vm'
    }
  }*/

})(angular);
