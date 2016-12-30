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
      vm.list = '[{brand:{brand:"北京汽车",firstletter:"B",id:14,brandid:14,logo:"B_BeiJingQiChe.png",isChecked:false},series:[{id:162,brandid:14,series:"北京汽车E系列",seriesid:162,isChecked:false},{id:158,brandid:14,series:"北京40",seriesid:158,isChecked:false},{id:159,brandid:14,series:"北京汽车BJ20",seriesid:159,isChecked:true},{id:160,brandid:14,series:"北京汽车BJ80",seriesid:160,isChecked:true},{id:161,brandid:14,series:"北京汽车B90",seriesid:161,isChecked:true}],year:[{id:384,brandid:14,seriesid:162,year:"2013",isChecked:false},{id:385,brandid:14,seriesid:162,year:"2012",isChecked:true},{id:382,brandid:14,seriesid:158,year:"2014",isChecked:false},{id:383,brandid:14,seriesid:158,year:"2015",isChecked:true}],output:[{id:14,brandid:14,seriesid:162,year:"2013",outputid:14,isChecked:false},{id:10,brandid:14,seriesid:162,year:"2013",output:"1.3L",outputid:10,isChecked:true},{id:32,brandid:14,seriesid:158,year:"2014",outputid:32,isChecked:false}],model:[{id:1812,modelid:1812,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 两厢 1.5L 手动乐天版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1814,modelid:1814,brandid:14,firstletter:"B",gearid:5,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 两厢 1.5L 自动乐天版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1816,modelid:1816,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 三厢 1.5L 手动乐天版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1817,modelid:1817,brandid:14,firstletter:"B",gearid:5,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 三厢 1.5L 自动乐天版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1818,modelid:1818,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 三厢 1.5L 手动乐尚版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1819,modelid:1819,brandid:14,firstletter:"B",gearid:5,logo:"B_BeiJingQiChe.png",model:"北京汽车E系列 2013款 三厢 1.5L 自动乐尚版",outputid:14,seriesid:162,structid:3,year:"2013"},{id:1808,modelid:1808,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京40 2014款 2.4L 手动征途版",outputid:32,seriesid:158,structid:2,year:"2014"},{id:1810,modelid:1810,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京40 2014款 2.4L 手动拓疆版",outputid:32,seriesid:158,structid:2,year:"2014"},{id:1811,modelid:1811,brandid:14,firstletter:"B",gearid:7,logo:"B_BeiJingQiChe.png",model:"北京40 2014款 2.4L 手动酷野版",outputid:32,seriesid:158,structid:2,year:"2014"}]},{brand:{brand:"本田",firstletter:"B",id:22,brandid:22,logo:"B_BenTian.png",isChecked:true}},{brand:{brand:"标致",firstletter:"B",id:24,brandid:24,logo:"B_BiaoZhi.png",isChecked:true}},{brand:{brand:"道奇",firstletter:"D",id:38,brandid:38,logo:"D_DaoQi.png",isChecked:true}}]';
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
      vm.checked = {
        checked: true,
        handler: function (checked) {
          if(checked){
            cbAlert.confirm('我是标题', function(isConfirm){
              vm.checked.checked = isConfirm
            });
          }
        }
      }


      vm.store = [
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
      vm.select = ['1','2','3'];

      vm.cancel = function(){
        console.log(1);

      }

      vm.number = 10000;
    }

})();
