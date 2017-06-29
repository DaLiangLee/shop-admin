## 指令 cbRemark

功能：
  1. 点击图标弹出备注输入框
  2. 如果有内容则图标颜色改变
  

属性:
  1. **`remarkContent`**: 双向数据绑定，表示备注框中的内容
  2. **`handleRemark`**: 回调函数，调用父作用域中的方法，用于数据的传递
  

## 用法 

使用示例:

html

```
# remarkContent
<div cb-remark remark-content="vm.remarkContent" handle-remark="vm.handleRemark(data)"></div>
```

控制器中(示例写法，实际写法可能有出入):

```
vm.remarkContent = "123";  // 数据，此处为示例，一般此数据从后端获取

// 控制器中的函数
vm.handleRemark = function(data) {
    vm.remarkContent = data;
}
```

## 待完成
1. 输入框的绝对定位，动态位置， 目前是写死为 'right: 20px'


