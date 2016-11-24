/**
 * Created by Administrator on 2016/11/11.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');
const generateJSON = require('./../generate');

var goods = generateJSON({
  'productid': '@id',
  'skuid': '@id',
  'cateid': '@natural(10, 30)',
  'brandid': 1,
  'parentid': 2,
  'mainphoto|1': [
    "@image('240x130', '#FF6600', '#FFF', 'png')",
    "@image('200x100', '#4A7BF7', '#FFF', 'png')",
    "@image('500x300', '#50B347', '#FFF', 'png')",
    "@image('300x700', '#4A7BF7', '#FFF', 'png')",
    "@image('100x200', '#894FC4', '#FFF', 'png')",
    "@image('1000x800', '#c7254e', '#FFF', 'png')",
    "@image('1000x300', '#cccccc', '#FFF', 'png')"
  ],
  'status|0-1': 0,
  'productname': '@ctitle(10, 40)',
  'catename': '@ctitle(3, 10)',
  'cnname': '@ctitle(2, 7)',
  'motorbrand': [],
  'unit|1': [
    "个", "桶", "毫米", "公斤", "件"
  ],
  'officialprice': '@float(0, 99999, 2)',
  'saleprice': '@float(0, 99999, 2)',
  'stock': '@float(0, 99999999, 0)',
  'skuvalues': [{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}],
  'abstracts': '@ctitle(1, 30)'
}, 100);

/**
 * 获取商品管理列表
 */
router.get('/product/goods', function (req, res, next) {
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
