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
