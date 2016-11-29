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
  "servernum|0-999": 0,
  "skuvalues": "[{\"guid\":0,\"id\":1,\"items\":[{\"guid\":0,\"id\":1,\"skuid\":1,\"skuvalue\":\"汽机油\",\"sort\":1}],\"skuname\":\"机油类别\",\"skutype\":\"text\",\"sort\":0},{\"guid\":0,\"id\":2,\"items\":[{\"guid\":0,\"id\":6,\"skuid\":2,\"skuvalue\":\"全合成机油\",\"sort\":1}],\"skuname\":\"机油分类\",\"skutype\":\"text\",\"sort\":0}]",
  "status|0-7": 0,
  "unit|1": [
    "个", "桶", "毫米", "公斤", "件"
  ],
  "username": phone
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
