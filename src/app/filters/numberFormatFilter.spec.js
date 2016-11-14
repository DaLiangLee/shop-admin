/**
 * Created by Administrator on 2016/11/5.
 */
describe('Unit: Filter Test', function () {
  /**
   * 模拟模块
   */
  beforeEach(module('shopApp'));
  /**
   * 注入依赖
   */
  var filter;
  beforeEach(inject(function(_$filter_) {
    filter = _$filter_;
  }));
  /**
   * 测试代码
   */
  it('numberFormatFilter 400 1 test', function () {
    expect(filter('numberFormatFilter')('4001611683','tel')).toEqual('400-1611-683');
  });
  it('numberFormatFilter 400 2 test', function () {
    expect(filter('numberFormatFilter')('40016116835','tel')).toEqual('40016116835');
  });
  it('numberFormatFilter 800 1 test', function () {
    expect(filter('numberFormatFilter')('8001611624','tel')).toEqual('800-1611-624');
  });
  it('numberFormatFilter 800 2 test', function () {
    expect(filter('numberFormatFilter')('800161165','tel')).toEqual('800161165');
  });
  it('numberFormatFilter phone 1 test', function () {
    expect(filter('numberFormatFilter')('13412345678','tel')).toEqual('134-1234-5678');
  });
  it('numberFormatFilter phone 2 test', function () {
    expect(filter('numberFormatFilter')('123456789012','tel')).toEqual('123456789012');
  });
  it('numberFormatFilter fixedTel 1 test', function () {
    expect(filter('numberFormatFilter')('01012345678','tel')).toEqual('010-1234-5678');
  });
  it('numberFormatFilter fixedTel 2 test', function () {
    expect(filter('numberFormatFilter')('02712345678','tel')).toEqual('027-1234-5678');
  });
  it('numberFormatFilter fixedTel 3 test', function () {
    expect(filter('numberFormatFilter')('07171234567','tel')).toEqual('0717-1234-567');
  });
  it('numberFormatFilter fixedTel 4 test', function () {
    expect(filter('numberFormatFilter')('0123456789','tel')).toEqual('012-3456-789');
  });
  it('numberFormatFilter bank 1 test', function () {
    expect(filter('numberFormatFilter')('1111111111111111','bank')).toEqual('1111-1111-1111-1111');
  });
  it('numberFormatFilter bank 2 test', function () {
    expect(filter('numberFormatFilter')('1111111111111111111','bank')).toEqual('1111-1111-1111-1111-111');
  });
  it('numberFormatFilter bank 3 test', function () {
    expect(filter('numberFormatFilter')('111111111111111111','bank')).toEqual('111111111111111111');
  });
});
