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
  "realname": '@cname',                           // 客户姓名
  "status|0-7": 0,                            // 订单状态
  "totalcost|0-1000": 0,                         // 商品总计（￥）
  "totalmile|1-100000": 1,                       // 总里程
  "totalsale|0-999": 0,                         // 工时总计（￥）
  "username": '@cname',                     // 客户手机
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
    "source|0-1": 0,     // 用户来源   0：线上；1：到店
    "userclass|0-1": 0,  // '会员类别 0：平台会员；1：线下会员
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

// 提醒客户
router.post('/trade/sorder/remind', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});

// 确认接车
router.post('/trade/sorder/confirmMotor', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});

// 取消订单
router.post('/trade/sorder/cancel', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});

// 获得服务报价列表
var data = generateJSON({
  "guid": "@id",
  "offerid": "@id",
  "serverid": "@id",
  "scateid1": "@id",
  "scateid2": "@id",
  "scatename1": '@ctitle(3, 6)',                 // 项目类型
  "scatename2": '@ctitle(3, 10)',              // 服务项目
  "pskuids": "803054742275125248,803104112571871232",
  "motorbrandids": "[{\"brand\":{\"brand\":\"%E5%AE%9D%E9%AA%8F\",\"firstletter\":\"B\",\"id\":9,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png\"}},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\"}}]",
  "warranty": _.random(0, 121),
  "saleprice": _.random(0.00, 999.99),                        // 工时费
  "groupprice": 0,
  "status|0-2": 0,                     // 子订单状态
  "productcost": _.random(0.00, 999.99),       // 商品价格
  "salenums": _.random(0, 999),
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',
  "uploadtime": '@date("yyyy-MM-dd HH:mm:ss")'
}, 30).data;

// 服务完成
router.post('/trade/sorder/finish', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});
// 子订单服务完成
router.post('/trade/sorder/childFinish', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});

// 客户提车
router.post('/trade/sorder/pickupMotor', function (req, res, next) {
  console.log(req.query);
  res.json({
    "status": "0",
    "data": ""
  });
});
router.post('/trade/sorder/offerprice', function (req, res, next) {
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 5)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});

// 获得服务报价列表
router.post('/trade/sorder/motor', function (req, res, next) {
  var data = generateJSON({
    "brand": "奔驰",
    "buydate": "",
    "clazz": "null",
    "createtime": 1479279474000,
    "engine": "null",
    "enginenumber": "123",
    "gear": "null",
    "guid": 798781968111116300,
    "imei": "862151031653452",
    "licence": "京A12345",
    "logo": "http://www.ichebian.com/appservice/public/logo/motor/B_BenChi.png",
    "model": "奔驰GLC 2016款 GLC 300 4MATIC 豪华型",
    "motorid": "798781968111116288",
    "output": "null",
    "owner": "",
    "photos": "null",
    "series": "奔驰GLC",
    "struct": "null",
    "style": "null",
    "totalmile": 10000,
    "vin": "1",
    "year": "null"
  }, 10).data;
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 5)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});

// 获得服务报价列表
router.post('/trade/sorder/detail', function (req, res, next) {
  res.json({
    "status": "0",
    "data": {
        "order": {
          "confirm": "0",
            "content": "服务项目保养",
            "createtime": 1480925509000,
            "enginenumber": "",
            "finishtime": 1480925509000,
            "guid": 805685985663832000,
            "licence": "京A23456",
            "meettime": 1480925509000,
            "mobile": "15271468663",
            "motorid": "804286926814191616",
            "motormodel": "比亚迪G3 2012款 1.8L CVT豪华型",
            "motortime": 1480925509000,
            "orderid": "805685985663832064",
            "ordertype": "0",
            "overtime": 1480925509000,
            "paystatus": "0",
            "paytime": 1480925509000,
            "realname": "刚",
            "status": "1",
            "storeid": "802334963159543808",
            "totalcost": 738,
            "totalmile": 0,
            "totalsale": 644,
            "userid": "784694265933463552",
            "vin": ""
        },
        "childs": [
          {
            "createtime": 1480925512000,
            "detailid": "805685998531960832",
            "guid": 805685998531960800,
            "offerid": "805646209036365824",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 738,
            "salenums": 0,
            "saleprice": 200,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998548738048",
            "guid": 805685998548738000,
            "offerid": "805376534083842048",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 111,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998565515264",
            "guid": 805685998565515300,
            "offerid": "805368660863528960",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 333,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998531960832",
            "guid": 805685998531960800,
            "offerid": "805646209036365824",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 738,
            "salenums": 0,
            "saleprice": 200,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998548738048",
            "guid": 805685998548738000,
            "offerid": "805376534083842048",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 111,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998565515264",
            "guid": 805685998565515300,
            "offerid": "805368660863528960",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 333,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998531960832",
            "guid": 805685998531960800,
            "offerid": "805646209036365824",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 738,
            "salenums": 0,
            "saleprice": 200,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998548738048",
            "guid": 805685998548738000,
            "offerid": "805376534083842048",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 111,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998565515264",
            "guid": 805685998565515300,
            "offerid": "805368660863528960",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 333,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998531960832",
            "guid": 805685998531960800,
            "offerid": "805646209036365824",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 738,
            "salenums": 0,
            "saleprice": 200,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998548738048",
            "guid": 805685998548738000,
            "offerid": "805376534083842048",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 111,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998565515264",
            "guid": 805685998565515300,
            "offerid": "805368660863528960",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 333,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998531960832",
            "guid": 805685998531960800,
            "offerid": "805646209036365824",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 738,
            "salenums": 0,
            "saleprice": 200,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998548738048",
            "guid": 805685998548738000,
            "offerid": "805376534083842048",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 111,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          },
          {
            "createtime": 1480925512000,
            "detailid": "805685998565515264",
            "guid": 805685998565515300,
            "offerid": "805368660863528960",
            "orderid": "805685985663832064",
            "packegid": "0",
            "productcost": 0,
            "salenums": 0,
            "saleprice": 333,
            "scatename1": "保养",
            "scatename2": "保养",
            "status": "0"
          }
        ]
    }
  });
});


module.exports = router;
