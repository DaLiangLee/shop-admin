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
      vm.list = [
        {"id":"1","group":"A","name":"AC Schnitzer","logo":"/motor/logo/A_AC-Schnitzer.png"},
        {"id":"2","group":"A","name":"Arash","logo":"/motor/logo/A_Arash.png"},
        {"id":"3","group":"A","name":"Artega","logo":"/motor/logo/A_Artega.png"},
        {"id":"4","group":"A","name":"阿尔法罗密欧","logo":"/motor/logo/A_AErFaLuoMiOu.png"},
        {"id":"5","group":"A","name":"阿斯顿·马丁","logo":"/motor/logo/A_ASiDunMaDing.png"},
        {"id":"6","group":"A","name":"安凯客车","logo":"/motor/logo/A_AnKaiKeChe.png"},
        {"id":"7","group":"A","name":"奥迪","logo":"/motor/logo/A_AoDi.png"},
        {"id":"8","group":"B","name":"巴博斯","logo":"/motor/logo/B_BaBoSi.png"},
        {"id":"9","group":"B","name":"宝骏","logo":"/motor/logo/B_BaoJun.png"},
        {"id":"10","group":"B","name":"保斐利","logo":"/motor/logo/B_BaoFeiLi.png"},
        {"id":"11","group":"B","name":"宝马","logo":"/motor/logo/B_BaoMa.png"},
        {"id":"12","group":"B","name":"宝沃","logo":"/motor/logo/B_BaoWo.png"},
        {"id":"13","group":"B","name":"保时捷","logo":"/motor/logo/B_BaoShiJie.png"},
        {"id":"14","group":"B","name":"北京汽车","logo":"/motor/logo/B_BeiJingQiChe.png"},
        {"id":"15","group":"B","name":"北汽幻速","logo":"/motor/logo/B_BeiQiHuanSu.png"},
        {"id":"16","group":"B","name":"北汽绅宝","logo":"/motor/logo/B_BeiJingQiChe.png"},
        {"id":"17","group":"B","name":"北汽威旺","logo":"/motor/logo/B_BeiQiWeiWang.png"},
        {"id":"18","group":"B","name":"北汽新能源","logo":"/motor/logo/B_BeiJingQiChe.png"},
        {"id":"19","group":"B","name":"北汽制造","logo":"/motor/logo/B_BeiQiZhiZao.png"},
        {"id":"20","group":"B","name":"奔驰","logo":"/motor/logo/B_BenChi.png"},
        {"id":"21","group":"B","name":"奔腾","logo":"/motor/logo/B_BenTeng.png"},
        {"id":"22","group":"B","name":"本田","logo":"/motor/logo/B_BenTian.png"},
        {"id":"23","group":"B","name":"比亚迪","logo":"/motor/logo/B_BiYaDi.png"},
        {"id":"24","group":"B","name":"标致","logo":"/motor/logo/B_BiaoZhi.png"}
      ];
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
      }
      vm.test1 = function () {
        cbAlert.success('成功', 'success');
      }

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
    }

})();
