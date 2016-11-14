/**
 * Created by Administrator on 2016/11/11.
 */
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');

/**
 * 获取店铺信息
 */
router.get('/store/shop/index', function (req, res, next) {
  res.json({
    "status": "0",
    "data": home.data[0]
  });
});

/**
 * 修改店铺信息
 */
router.post('/product/goods/category', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});

/**
 * 修改店铺信息
 */
router.post('/product/goods/attrsku', function (req, res, next) {
  res.json({
    "data": {
      "sku": GOODS_ATTRSKU.sku,
      "brand": GOODS_ATTRSKU.brand,
      "attributeset": GOODS_ATTRSKU.attributeset
    },
    "status": "0"
  });
});

/**
 * 修改店铺信息
 */
router.post('/product/goods/save', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": "",
    "status": "0"
  });
});
module.exports = router;
