/**
 * Created by Administrator on 2016/11/4.
 */
describe('Unit: Directive Test', function () {
  var $compile, $rootScope, element;
  /**
   * 模拟模块
   */
  beforeEach(module('shopApp'));
  /**
   * 注入依赖
   */
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.list = [
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
    element = $compile('<div simple-select="id,name" store="list" select="select"></div>')($rootScope);
    $rootScope.$digest();
  }));

  /**
   * 测试代码
   */

  // 获取li长度
  it('init 获取li长度', function() {
    expect(element.find('li').length).toEqual(24);
  });
  // 设置正确的值 预期：取到id为2的name是Arash
  it('set select correctly', function() {
    $rootScope.select = '2';  // 注意值要和数据里面值对应，全等
    $rootScope.$digest();
    expect(element.find('li.active span').text()).toEqual("Arash");
  });
  // 设置错误的值 预期：什么都没有
  it('sets select error', function() {
    $rootScope.select = '0';
    $rootScope.$digest();
    expect(element.find('li.active span').text()).toEqual("");
    expect(element.find('li.active').length).toEqual(0);

  });
});
