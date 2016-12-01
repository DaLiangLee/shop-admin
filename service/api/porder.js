/**
 * Created by Administrator on 2016/11/28.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const generateJSON = require('./../generate');

const phone = /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/;

const DEFAULT_DATA = generateJSON({
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',    // 创建时间
  "detailid": "@id",                             // 订单详情id
  "finishtime": '@date("yyyy-MM-dd HH:mm:ss")',   // 完成时间
  "guid": "@id",
  "offerid": "801397400173326336",
  "orderid": "1",                                 // 订单id
  "ordertype": "1",                               // 订单类型
  "paystatus|0-3": 0,                             // 付款状态
  "paytime": '@date("yyyy-MM-dd HH:mm:ss")',      // 付款时间
  "pcateid": "@id",
  "pcatename": '@ctitle(2, 7)',
  "porderid": "1",
  "pcatename1": "1",                              // 商品一级类目
  "pcatename2": "1",                              // 商品二级类目
  "scatename1": "1",                              // 服务一级类目
  "scatename2": "1",                              // 服务一级类目
  "productname": "@ctitle(10, 40)",                // 商品名称
  "pskuid": "@id",                                // 商品skuid
  "realname": "@cname()",                         // 客户姓名
  "remark": "@ctitle(10, 30)",                 // 订单备注
  "saleprice|1-1000": 1,                       // 商品单价
  "servercateid": "@id",
  "servernum|0-999": 0,                       // 数量
  "skuvalues": "[{\"guid\":0,\"id\":1,\"items\":[{\"guid\":0,\"id\":1,\"skuid\":1,\"skuvalue\":\"汽机油\",\"sort\":1}],\"skuname\":\"机油类别\",\"skutype\":\"text\",\"sort\":0},{\"guid\":0,\"id\":2,\"items\":[{\"guid\":0,\"id\":6,\"skuid\":2,\"skuvalue\":\"全合成机油\",\"sort\":1}],\"skuname\":\"机油分类\",\"skutype\":\"text\",\"sort\":0}]",
  "status|0-2": 0,    // 订单状态
  "unit|1": [          // 单位
    "个", "桶", "毫米", "公斤", "件"
  ],
  "mobile": phone,    // 客户联系方式
  "username": phone,   // 客户账户
  "motormodel": "奔驰GLC 2016款 GLC 300 4MATIC 豪华型",     // 车型
  "psaleprice": 0,
  "pskuvalues": "1",
  "serverid": "@id",         //  服务编码
  "productid": "@id",         //  商品编码
  "servername": "1",                      // 服务名称
  "ssaleprice": 0,                        //
  "sskuvalues": "1",
  "storeid": "@id"    // 店铺id
}, 30);

var UID = 30;

var porder = DEFAULT_DATA.data.concat([]);

router.get('/trade/porder', function (req, res, next) {
  var data = porder;
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 10)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});


module.exports = router;
