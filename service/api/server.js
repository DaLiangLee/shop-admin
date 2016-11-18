/**
 * Created by Administrator on 2016/11/17.
 */
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');
const generateJSON = require('./../generate');

var goods = generateJSON({
  'serverid': '@id',
  'status|0-1': 0,
  'servername': '@ctitle(10, 40)',
  'servertype': '@ctitle(3, 10)',
  'motorbrand': [],
  'abstracts': '@ctitle(1, 30)'
}, 100);

/**
 * 获取商品管理列表
 */
router.get('/product/server', function (req, res, next) {
  var data = goods.data.concat([]);
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 10)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});


/**
 * 获取获取商品类目
 */
router.post('/product/goods/category', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});

/**
 * 获得与商品类目关联的品牌、属性集及其SKU
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
 * 保存商品
 */
router.post('/product/goods/save', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": "",
    "status": "0"
  });
});
module.exports = router;

/**
 * 编辑商品
 */
router.post('/product/goods/edit', function (req, res, next) {
  console.log(req.query.skuid);

  var data = _.find(goods.data, {skuid: req.query.skuid});
  res.json({
    "data": data,
    "status": "0"
  });
});


/**
 * 删除商品
 */
router.post('/product/goods/remove', function (req, res, next) {
  console.log(req.query.productid);
  _.remove(goods.data, {productid: req.query.productid});
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 调整价格
 */
router.post('/product/goods/price', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].saleprice = req.query.saleprice;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/goods/putup', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].status = 1;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品下架
 */
router.post('/product/goods/putdown', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].status = 0;
  res.json({
    "data": "",
    "status": "0"
  });
});
module.exports = router;
