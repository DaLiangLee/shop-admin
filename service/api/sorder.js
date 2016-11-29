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
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',
  "detailid": "@id",
  "finishtime": '@date("yyyy-MM-dd HH:mm:ss")',
  "guid": "@id",
  "model": "奔驰GLC 2016款 GLC 300 4MATIC 豪华型",
  "offerid": "801397400173326336",
  "orderid": "1",
  "ordertype": "1",
  "paystatus|0-3": 0,
  "paytime": '@date("yyyy-MM-dd HH:mm:ss")',
  "pcateid": "@id",
  "pcatename": '@ctitle(2, 7)',
  "porderid": "1",
  "productname": "@ctitle(10, 40)",
  "pskuid": "@id",
  "realname": "@cname()",
  "remark": "@ctitle(10, 30)",
  "saleprice|1-1000": 1,
  "scatename": "机油更换",
  "servercateid": "@id",
  "status|0-7": 0,
  "username": phone,
  "confirm|0-1": 0,
  "content": "asds",
  "engine": "null",
  "licence": "京A12345",
  "meettime": '@date("yyyy-MM-dd HH:mm:ss")',
  "mobile": "null",
  "motortime": '@date("yyyy-MM-dd HH:mm:ss")',
  "overtime": '@date("yyyy-MM-dd HH:mm:ss")',
  "totalcost": 0,
  "totalmile": 7630,
  "totalsale": 0,
  "vin": ""

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
module.exports = router;
