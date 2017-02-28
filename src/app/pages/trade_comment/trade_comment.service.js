/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('tradeComment', tradeComment)
        .factory('tradeCommentConfig', tradeCommentConfig);

    /** @ngInject */
    function tradeComment(requestService) {
      return requestService.request('trade', 'comment');
    }

    /** @ngInject */
    function tradeCommentConfig() {
        return {
            DEFAULT_GRID: {
                "columns": [
                    {
                        "id": 0,
                        "name": "序号",
                        "none": true
                    },
                    {
                      "id": 1,
                      "name": "会员",
                      "cssProperty": "state-column",
                      "fieldDirective": '<a ui-sref="user.customer.edit({mobile: item.username})" bo-text="item.realname"></a>',
                      "width": 180
                    },
                    {
                      "id": 2,
                      "name": "评分",
                      "cssProperty": "state-column",
                      "fieldDirective": '<ul class="list-unstyled"><li>技术：<div cb-star star="item.star.skill">{{item.star.skill}}</div></li><li>服务：<div cb-star star="item.star.service">{{item.star.service}}</div></li><li>环境：<div cb-star star="item.star.environment">{{item.star.environment}}</div></li></ul>',
                      "width": 180
                    },
                    {
                      "id": 3,
                      "name": "评价时间",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.commenttime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>',
                      "width": 160
                    },
                    {
                      "id": 4,
                      "name": "订单编号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span bo-text="item.orderid"></span>',
                      "width": 170
                    },
                    {
                      "id": 5,
                      "name": "订单内容",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.content"></span>',
                      "width": 180
                    },
                    {
                      "id": 6,
                      "name": "评价图片",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-repeat="pic in item.pic" style="display: inline-block; width: 80px; height: 80px; overflow: hidden;"><img width="80px" height="80px" bo-src-i="{{pic}}"></span>',
                      "width": 300
                    },
                    {
                      "id": 7,
                      "name": "评价内容",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.comment"></span>',
                      "width": 300
                    },
                    {
                      "id": 8,
                      "name": "回复",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-if="!item.replytime" cb-access-control="chebian:store:trade:comment:reply" cb-message-board="editor" content="item.reply" config="propsParams.replyConfig" title="回复评价" review-item="propsParams.replyItem(data, item)">未回复</span><span class="state-unread" bo-if="item.replytime" cb-message-board="review" content="item.reply" config="propsParams.replyConfig" title="查看回复" cb-access-control="chebian:store:trade:comment:details">已回复</span>',
                      "width": 100
                    }
                ],
                "config": {
                    'settingColumnsSupport': false,   // 设置表格列表项
                    'checkboxSupport': false,  // 是否有复选框
                    'sortSupport': true,
                    'paginationSupport': true,  // 是否有分页
                    'selectedProperty': "selected",  // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true,  // 是否单向绑定
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': []
                }
            },
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'product-goods',
                    "searchDirective": [
                        {
                            'label': "订单编号",
                            'type': 'text',
                            'searchText': "orderid",
                            'placeholder': '订单编号'
                        },
                        {
                            'label': "商品名称",
                            'type': 'text',
                            'searchText': "productname",
                            'placeholder': '商品名称'
                        },
                        {
                          'label': "客户名称",
                          'type': 'text',
                          'searchText': "realname",
                          'placeholder': '客户名称'
                        },
                        {
                            'label': "订单状态",
                            'type': 'select',
                            'searchText': "status",
                            'placeholder': '订单状态',
                            'list': [
                              {
                                id: -1,
                                name: "全部"
                              },
                              {
                                id: 0,
                                name: "下架"
                              },
                              {
                                id: 1,
                                name: "上架"
                              },
                              {
                                id: 2,
                                name: "禁用"
                              }
                            ]
                        }
                    ]
                }
            }
        }
    }

})();
