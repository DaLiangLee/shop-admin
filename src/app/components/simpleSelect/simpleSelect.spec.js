/**
 * Created by Administrator on 2016/11/4.
 */
describe('Unit: Directive Test', function () {
  /**
   * 模拟模块
   */
  beforeEach(module('shopApp'));
  /**
   * 注入依赖
   */
  var scope, iElement, body;
  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope;
    scope.list = [
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
    scope.select = "1";
    body = angular.element('body');
    iElement = $compile('<div simple-select="id,name" store="scope.list" select="scope.select"></div>')(scope);
    scope.$digest();
  }));

/*  function compileDirective(tpl) {
    // function to compile a fresh directive with the given template, or a default one
    // compile the tpl with the $rootScope created above
    // wrap our directive inside a form to be able to test
    // that our form integration works well (via ngModelController)
    // our directive instance is then put in the global 'elm' variable for further tests

    // inject allows you to use AngularJS dependency injection
    // to retrieve and use other services
    inject(function($compile) {

      elm = select.find('div');
    });
    // $digest is necessary to finalize the directive generation

  }*/
  /**
   * 测试代码
   */
  describe('initialisation', function() {
    // before each test in this block, generates a fresh directive
    /*beforeEach(function() {
      compileDirective();
    });*/
    // a single test example, check the produced DOM
    it('should produce 2 buttons and a div', function() {
      //$digest 方法对于生成指令是必要的。
      expect(iElement.find('button').length).toEqual(2);
      expect(iElement.find('div').length).toEqual(1);
    });
    it('should check validity on init', function() {
      //expect(scope.form.$valid).toBeTruthy();
    });
  });
});
