/**
 * Created by Administrator on 2016/11/5.
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
    iElement = angular.element('<div cb-message-tips config="config"></div>');
    body = angular.element('body');
    $compile(iElement)(scope);
    scope.$apply();
  }));
  /**
   * 测试代码
   */
  it('cbMessageTips 1 test', function () {
    scope.$apply(function () {
      scope.config = {};
    });
    expect(body.html()).toContain('<div class="cb-message-tips ng-scope"');
  });
  it('cbMessageTips 2 test', function () {
    scope.$apply(function () {
    });
    expect(body.html()).toContain('<div class="cb-message-tips ng-scope"');
  });
});
