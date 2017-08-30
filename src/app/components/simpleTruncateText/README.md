# simpleTruncateText是一个通用的文本截断

## 支持功能
1. 支持单选，多选
2. 支持回调方法
3. 支持显示类型name，value，iamge（根据需求配置）
4. 支持选择一次once功能，不能再选择功能
5. 支持搜索功能

## config配置
- simple-truncate-text: string     显示文本
- offset: number        偏移量；默认0  当前显示文本宽度=直接父级宽度-offset-30
- bindevent: true       父级是否有绑定事件 默认flase 如果有就用传统的title显示超出提示文本
- resize: true          是否支持resize事件 默认false
- trigger: string       触发事件 mouseenter|click 默认mouseenter
- tooltipPlacement: string  显示位置 right|bottom|left|top-left|top-right|right-top|top 默认top



## 举个栗子
1. 默认配置

html书写
```
<div simple-truncate-text="{{呵呵}}"></div>
```

2. 支持resize事件配置

html书写
```
<div simple-truncate-text="{{呵呵}}" resize="true"></div>
```