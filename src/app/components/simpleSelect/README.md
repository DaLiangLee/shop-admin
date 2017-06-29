# simpleSelect是一个通用的下拉组件

## 支持功能
1. 支持单选，多选
2. 支持回调方法
3. 支持显示类型name，value，iamge（根据需求配置）
4. 支持选择一次once功能，不能再选择功能
5. 支持搜索功能

## config配置
- multiple: boolean     是否多选
- search: boolean       是否开启搜索   超过一平熟练以后才会显示搜索框
- once: boolean         是否只点击一此
- value: string         指定返回的值的字段
- name: string          指定显示列表的字段
- image: string         指定显示列表的字段

## scope配置
- store: array             数据
- select: string|array     根据value指定返回对应的值  
- selectHandler: function  每次选择回调函数
- searchHandler: function  每次搜索回调函数（暂无用，留以后ajax获取列表使用）

## 举个栗子
1. 简单配置(书写)

html书写
```
<div simple-select="id,catename" store="vm.brandModel.store" select="vm.brandModel.pcateid1" select-handler="vm.brandModel.handler(data)"></div>
```
控制器书写
```
vm.brandModel = {
  select: "1",
  store: [
    {
       id: 1,
       catename: "name"
    }
  ],
  handler: function (data) {
    console.log(data);
  }
};
```
> 注意回调里面返回data是根据value过滤的值，单选返回字符串，多选返回数组
simple-select填写的格式‘value,name | value,name,image’，
value是提交的值，name和images是需要显示的值
如果select填写值，就会在下拉列表里面对应值高亮显示。


### 业务流程
1. 下拉选择
2. 点击展开
3. 加载我们选择数据
4. 选择这些数据
5. 统一行为 点击表示选中
6. 业务希望单选
7. 业务希望多选
8. 业务需要只选一次
9. 鼠标离开下拉框自动隐藏
10. 单选操作时候，点击选中以后，下拉框自动隐藏
11. 只选一次操作时候，点击选中以后，下拉框自动隐藏，不能再点击操作
12. 多选操作可以选多个，下拉不会消失，直到鼠标离开下拉框位置，才消失
13. 多选会返回结果在显示框里面，可以擦除。擦除以后，下拉框里面选中也消失
14. 给入口值，分2种，一种单选是字符串，多项就是数组（根据配置获取当前值）
15. 回调函数，选中以后触发返回参数带，选中的结果，字符串和数组
16. 怎么获取数据和当前的这个下拉框绑定，需要配置匹配规则（name，value，images）vlue和images就是显示的是数据 name返回数据
17. 功能类型 单选，多选，只选一次操作

### 总结
15 17 配置需要做
16 自定义事件
14 交互数据
剩下全部业务逻辑

config
  type: {
    type: string,
    default: 'single'   // 'multiple' 'once'
  },
  value: {
    type: string,
    default: -,
    required: true
  },
  name: {
    type: string,
    default: -,
    required: true
  },
  image: {
    type: string,
    default: -
  },
  store: {
    type: array,
    default: [],
    required: true
  },
   select: {
     type: string|array,
     default: undefined
   },
   selectHandler: {
      type: function,
      default: undefined
   }


## 工程目录
一堆工具依赖配置
src 源文件
dise  目标文件
dist  
node_modules   node的包
e2e   测试
service 自己模拟小后台
gulp  自动化构建配置

src 
  index.html   入口页面
  assets       静态资源 图片 字体 其他兼容处理东西
  app          主要项目文件
   components    组件型指令
   configs       配置
   constants     常量
   decorations   装饰器指令
   filters       过滤器
   modules       模块
   services      服务
   styles        样式
   pages         页面
   


