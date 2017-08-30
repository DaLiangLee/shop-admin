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
                "columns": [{
                        "id": 0,
                        "name": "序号",
                        "none": true
                    },
                    {
                        "id": 1,
                        "name": "会员",
                        "cssProperty": "state-column",
                        "fieldDirective": '<a ui-sref="user.customer.edit({mobile: item.username})" bo-text="item.realname"></a>',
                        "width": 120
                    },
                    {
                        "id": 2,
                        "name": "评分",
                        "cssProperty": "state-column",
                        "fieldDirective": '<ul class="list-unstyled"><li>技术：<div cb-star star="item.star.skill">{{item.star.skill}}</div></li><li>服务：<div cb-star star="item.star.service">{{item.star.service}}</div></li><li>环境：<div cb-star star="item.star.environment">{{item.star.environment}}</div></li></ul>',
                        "width": 160
                    },
                    {
                        "id": 3,
                        "name": "评价时间",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.commenttime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>',
                        "width": 140
                    },
                    {
                        "id": 4,
                        "name": "订单编号",
                        "cssProperty": "state-column",
                        "fieldDirective": '<a bo-text="item.orderid" ui-sref="trade.order.list({page:1, keyword: item.orderid})"></a>',
                        "width": 120
                    },
                    {
                        "id": 5,
                        "name": "评价图片/内容",
                        "cssProperty": "state-column",
                        "fieldDirective": '<p bo-if="item.pic"><span class="state-unread" ng-repeat="pic in item.pic" style="display: inline-block; width: 70px; height: 65px; overflow: hidden;"><img width="65px" height="65px" bo-src-i="{{pic}}?x-oss-process=image/resize,m_fixed,h_65,w_65"></span></p><span class="state-unread" bo-bind="item.comment"></span>',
                        "width": 300
                    },
                    {
                        "id": 6,
                        "name": "订单内容",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.content"></span>',
                        "width": 180
                    },
                    {
                        "id": 7,
                        "name": "回复",
                        "cssProperty": "state-column",
                        "fieldDirective": '<a class="state-unread" bo-if="!item.replytime" cb-access-control="shopapp:store:trade:comment:reply" cb-message-board="editor" content="item.reply" config="propsParams.replyConfig" title="回复评价" review-item="propsParams.replyItem(data, item)">未回复</a><a class="state-unread" bo-if="item.replytime" cb-message-board="review" content="item.reply" config="propsParams.replyConfig" title="查看回复" cb-access-control="shopapp:store:trade:comment:details">已回复</a>',
                        "width": 70
                    }
                ],
                "config": {
                    'settingColumnsSupport': false, // 设置表格列表项
                    'checkboxSupport': false, // 是否有复选框
                    'sortSupport': true,
                    'paginationSupport': true, // 是否有分页
                    'selectedProperty': "selected", // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true, // 是否单向绑定
                    "paginationInfo": { // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': []
                }
            },
            DEFAULT_SEARCH: {

            }
        }
    }

})();