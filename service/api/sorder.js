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
  "confirm|0-1": 0,     // 客户确认状态
  "content": "@ctitle(10, 30)",     // 订单内容
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',   // 订单创建时间
  "finishtime": '@date("yyyy-MM-dd HH:mm:ss")',    // 服务完成时间
  "guid": 1,
  "licence": "京A12345",    // 车牌照
  "meettime": '@date("yyyy-MM-dd HH:mm:ss")',   // 预约到店时间
  "mobile": phone,                         // 联系方式
  "motortime": '@date("yyyy-MM-dd HH:mm:ss")',   //
  "orderid": "@id",                               // 订单编号
  "overtime": '@date("yyyy-MM-dd HH:mm:ss")',   // 订单完成时间
  "paystatus|0-3": 0,                           // 付款状态
  "paytime": '@date("yyyy-MM-dd HH:mm:ss")',    // 付款时间
  "realname": "刚",                           // 客户姓名
  "status|0-7": 0,                            // 订单状态
  "totalcost|0-1000": 0,                         // 商品总计（￥）
  "totalmile|1-100000": 1,                       // 总里程
  "totalsale|0-999": 0,                         // 工时总计（￥）
  "username": phone,               // 客户手机
  "vin": "",                              // vin码
  "userid": "@id",                    // 用户id
  "enginenumber": "1",                 // 发动机编号
  "motorid": "1",                      // 车型id
  "motormodel": "奔驰GLC 2016款 GLC 300 4MATIC 豪华型",  // 车型
  "ordertype": "1",                    // 订单类型
  "storeid": "802334963159543808"      //  店铺id
}, 30);

var sorder = DEFAULT_DATA.data.concat([]);

router.get('/trade/sorder', function (req, res, next) {
  var data = sorder;
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 10)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});

router.post('/trade/sorder/user', function (req, res, next) {
  var data = generateJSON({
    "source|0-1": 0,     // 用户来源
    "guid": 1,
    "userid": "@id",                               // 用户编号
    "realname": '@cname',                           // 客户姓名
    "usertype|0-1": 0,                            // 用户类型
    "username": phone               // 客户手机
  }, 30).data;
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 5)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});







module.exports = router;
