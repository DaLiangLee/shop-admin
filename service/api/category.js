/**
 * Created by Administrator on 2016/12/3.
 */
'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');

/**
 * 获取获取商品类目
 */
router.post('/category/goods', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});


/**
 * 获取获取服务类目
 */
router.post('/category/server', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});


module.exports = router;
