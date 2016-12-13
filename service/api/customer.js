/**
 * Created by Administrator on 2016/12/8.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const generateJSON = require('./../generate');

const phone = /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/;

const DEFAULT_DATA = generateJSON({
  "guid": "@id",
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',    // 创建时间
  "realname": "@cname()",                         // 客户姓名
  "mobile": phone,                                // 客户联系方式
  "username": phone,                             // 客户账号
  "userClass|0-1": 0,                               // 会员类别
  "sex|0-1": 0,                               // 会员性别
  "age|18-60": 18,                            // 会员年龄
  "motorbrandids": "[]",                     // 所有车辆
  "recentOrders": "801397400173326336",        // 最新订单
  "remark": "@ctitle(10, 30)"                // 备注
}, 30);

router.get('/user/customer', function (req, res, next) {
  var data = DEFAULT_DATA.data;
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
