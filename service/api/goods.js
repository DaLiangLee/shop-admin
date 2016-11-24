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
  'motobrandids': '[{"brand":{"brand":"AC%20Schnitzer","firstletter":"A","id":1,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png"},"series":[{"id":101,"brandid":1,"series":"%E5%AE%9D%E9%A9%AC5%E7%B3%BB"},{"id":99,"brandid":1,"series":"%E5%AE%9D%E9%A9%AC2%E7%B3%BB%E6%97%85%E8%A1%8C%E8%BD%A6"},{"id":99,"brandid":1,"series":"%E5%AE%9D%E9%A9%AC2%E7%B3%BB%E6%97%85%E8%A1%8C%E8%BD%A6"},{"id":99,"brandid":1,"series":"%E5%AE%9D%E9%A9%AC2%E7%B3%BB%E6%97%85%E8%A1%8C%E8%BD%A6"},{"id":99,"brandid":1,"series":"%E5%AE%9D%E9%A9%AC2%E7%B3%BB%E6%97%85%E8%A1%8C%E8%BD%A6"}],"year":[{"id":288,"brandid":1,"seriesid":99,"year":"2014"},{"id":290,"brandid":1,"seriesid":99,"year":"2013"},{"id":289,"brandid":1,"seriesid":99,"year":"2016"},{"id":287,"brandid":1,"seriesid":99,"year":"2015"}],"output":[{"id":25,"brandid":1,"seriesid":99,"year":"2015","output":"2.0T"}],"model":[{"brandid":1,"gearid":23,"logo":"B_BaoMa.png","model":"%E5%AE%9D%E9%A9%ACX5%202015%E6%AC%BE%20xDrive35i%E4%B8%AD%E5%9B%BD%E9%99%90%E9%87%8F%E7%89%88","outputid":25,"seriesid":99,"structid":2,"year":"2015"}]}]#[{"brand":{"brand":"%E9%98%BF%E5%B0%94%E6%B3%95%E7%BD%97%E5%AF%86%E6%AC%A7","firstletter":"A","id":4,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AErFaLuoMiOu.png"}}]#[{"brand":{"brand":"%E9%98%BF%E6%96%AF%E9%A1%BF%C2%B7%E9%A9%AC%E4%B8%81","firstletter":"A","id":5,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_ASiDunMaDing.png"}}]#[{"brand":{"brand":"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6","firstletter":"A","id":6,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png"}}]#[{"brand":{"brand":"%E5%A5%A5%E8%BF%AA","firstletter":"A","id":7,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png"}},{"brand":{"brand":"%E5%B7%B4%E5%8D%9A%E6%96%AF","firstletter":"B","id":8,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png"}}]#[{"brand":{"brand":"%E5%AE%9D%E9%AA%8F","firstletter":"B","id":9,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png"}}]#[{"brand":{"brand":"%E5%AE%9D%E9%A9%AC","firstletter":"B","id":11,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png"}}]#[{"brand":{"brand":"AC%20Schnitzer","firstletter":"A","id":99,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png"},"series":[{"id":100,"brandid":99,"series":"%E5%AE%9D%E9%A9%AC3%E7%B3%BB"}]}]',
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
