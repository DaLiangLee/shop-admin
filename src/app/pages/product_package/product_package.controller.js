/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ProductPackageListController', ProductPackageListController);

    /** @ngInject */
    function ProductPackageListController(cbAlert) {
      var vm = this;
      vm.list = '';
      vm.select1 = "1";
      vm.select2 = ['1'];
      vm.test = function () {
        cbAlert.alert({
          'title': '我是标题',
          'text': '我是说明文字',
          'type': 'input',
          'inputPlaceholder': "呵呵",
          'showCancelButton': true,
          'showLoaderOnConfirm': true,
          'allowOutsideClick': true
        }, function(isConfirm){
          console.log(isConfirm);

          setTimeout(function(){
            cbAlert.success('成功', 'success');
          }, 30000)
        });
      };
      vm.test1 = function () {
        cbAlert.success('成功', 'success');
      };

      /*cbAlert.alert({
        'title': '我是标题',
        'text': '我是说明文字',
        'type': 'input',
        'inputPlaceholder': "呵呵",
        'showCancelButton': false,
        'delay': 3000
      }, function(isConfirm){

        if(isConfirm){
          cbAlert.success('成功', '提交成功');
        }else{
          cbAlert.error('失败', '提交失败');
        }
      });*/
/*      setTimeout(function(){
        cbAlert.close();
      }, 5000);*/

      vm.modified = {
        store: [{"id":12,"items":[{"id":57,"skuid":12,"skuvalue":"15寸","sort":1},{"id":58,"skuid":12,"skuvalue":"16寸","sort":2},{"id":59,"skuid":12,"skuvalue":"17寸","sort":3},{"id":60,"skuid":12,"skuvalue":"18寸","sort":4},{"id":61,"skuid":12,"skuvalue":"19寸","sort":5},{"id":62,"skuid":12,"skuvalue":"其他","sort":6}],"skuname":"轮胎尺寸","skutype":"text","sort":0},{"id":13,"items":[{"id":63,"skuid":13,"skuvalue":"防爆轮胎","sort":1},{"id":64,"skuid":13,"skuvalue":"雪地轮胎","sort":2},{"id":65,"skuid":13,"skuvalue":"轿车轮胎","sort":3},{"id":66,"skuid":13,"skuvalue":"SUV轮胎","sort":4},{"id":67,"skuid":13,"skuvalue":"其他","sort":5}],"skuname":"轮胎类型","skutype":"text","sort":0},{"id":14,"items":[{"id":68,"skuid":14,"skuvalue":"155","sort":1},{"id":69,"skuid":14,"skuvalue":"165","sort":2},{"id":70,"skuid":14,"skuvalue":"175","sort":3},{"id":71,"skuid":14,"skuvalue":"185","sort":4}],"skuname":"胎面宽度","skutype":"text","sort":0}],
        select: [{"id":12,"items":[{"id":57,"skuid":12,"skuvalue":"15寸","sort":1}],"skuname":"轮胎类型","skutype":"text","sort":0}],
        handler: function (data) {
          console.log(data);

        }
      };


    }

})();
