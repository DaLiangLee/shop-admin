/**
 * Created by Administrator on 2016/11/4.
 */
describe('Router test', function () {
  /**
   * 模拟模块
    */
  beforeEach(module('shopApp'));
  var state, location, rootScope;
  beforeEach(inject(function(_$location_, _$state_, _$rootScope_) {
    state = _$state_;
    location = _$location_;
    rootScope = _$rootScope_;
  }));

  /**
   * 404测试
   */
  describe('404 router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/error/notfound.html').respond('200', 'notfound')
    }));
  });
  it('notfound', function () {
    // 设置跳转
    location.path('/1');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('ErorNotfoundController')
  });

  /**
   * 403测试
   */
  describe('403 router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/error/forbidden.html').respond('200', 'forbidden')
    }));
  });
  it('forbidden', function () {
    // 设置跳转
    location.path('/forbidden');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('ErrorForbiddenController')
  });


  /**
   * 控制台测试
   */
  describe('desktop router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/desktop_home/home.html').respond('200', 'desktop_home')
    }));
  });
  it('home', function () {
    // 设置跳转
    location.path('/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('DesktopHomeController')
  });
  it('home', function () {
    // 设置跳转
    location.path('');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('DesktopHomeController')
  });

  /**
   * 店铺管理测试
   */
  describe('store router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/store_shop/home.html').respond('200', 'store_home')
    }));
  });
  it('store', function () {
    // 设置跳转
    location.path('/store');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('StoreShopHomeController')
  });
  it('store /', function () {
    // 设置跳转
    location.path('/store/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('StoreShopHomeController')
  });
  it('store shop', function () {
    // 设置跳转
    location.path('/store/shop');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('StoreShopHomeController')
  });
  it('store shop /', function () {
    // 设置跳转
    location.path('/store/shop/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('StoreShopHomeController')
  });

  /**
   * 员工管理测试
   */
  describe('member router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/member_employee/list.html').respond('200', 'member_employee')
    }));
  });
  it('member', function () {
    // 设置跳转
    location.path('/member');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });
  it('member /', function () {
    // 设置跳转
    location.path('/member/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });
  it('member employee', function () {
    // 设置跳转
    location.path('/member/employee');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });
  it('member employee /', function () {
    // 设置跳转
    location.path('/member/employee/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });
  it('member employee list', function () {
    // 设置跳转
    location.path('/member/employee/list');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });
  it('member employee /', function () {
    // 设置跳转
    location.path('/member/employee/list/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('MemberEmployeeListController')
  });

  /**
   * 角色管理测试
   */
  describe('system router', function () {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.expectGET('app/pages/member_role/list.html').respond('200', 'member_role')
    }));
  });
  it('system', function () {
    // 设置跳转
    location.path('/system');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('ErorNotfoundController')
  });
  it('system /', function () {
    // 设置跳转
    location.path('/system/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('ErorNotfoundController')
  });
  it('store role', function () {
    // 设置跳转
    location.path('/system/role');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('SystemRoleLsitController')
  });
  it('system role /', function () {
    // 设置跳转
    location.path('/system/role/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('SystemRoleLsitController')
  });
  it('system role list', function () {
    // 设置跳转
    location.path('/system/role/list');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('SystemRoleLsitController')
  });
  it('system role list /', function () {
    // 设置跳转
    location.path('/system/role/list/');
    /**
     * 调用digest循环
     */
    rootScope.$digest();
    /**
     * 测试当前的控制器是否预期
     */
    expect(state.current.controller).toBe('SystemRoleLsitController')
  });

});
