## 指令名
cbAmount

## 指令属性
1. maxNum: 表示最大输入的数值(必填)
2. minNum: 表示最小输入的数值(必填)
3. factor: 表示加减的系数，默认值为1(可选)
4. precision: 表示精度，即保留小数点的位数，默认值为0(可选)
5. base: 外部控制器传入的数据，表示默认值
6. getBase: 方法， 表示将更新数量

## 使用方式

```
// 可以参考 pages/trade_order/change.html 页面中
<div 
   cb-amount 
   base="subitem.num"
   get-base="vm.updateProductnumber(data, subitem, item)" 
   max-num="1000" 
   min-num="0" 
   factor="0.1" 
   precision="1"
>
</div>
```