/**
 * Created by Administrator on 2016/11/17.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');
const generateJSON = require('./../generate');

var goods = generateJSON({
  "abstracts": "asdasd爱的十大阿萨德",
  "audit": "0",
  "cateid": 2,
  "guid": '@id',
  "motorbrandids": "[{\"brand\":{\"brand\":\"%E5%AE%9D%E9%AA%8F\",\"firstletter\":\"B\",\"id\":9,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png\"}},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\"}}]#[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"},\"series\":[{\"id\":38,\"brandid\":7,\"series\":\"%E5%A5%A5%E8%BF%AAA4\"}]},{\"brand\":{\"brand\":\"%E5%A5%94%E9%A9%B0\",\"firstletter\":\"B\",\"id\":20,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png\"},\"series\":[{\"id\":214,\"brandid\":20,\"series\":\"%E5%A5%94%E9%A9%B0E%E7%BA%A7(%E8%BF%9B%E5%8F%A3)\"}]}]#[{\"brand\":{\"brand\":\"%E9%98%BF%E6%96%AF%E9%A1%BF%C2%B7%E9%A9%AC%E4%B8%81\",\"firstletter\":\"A\",\"id\":5,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_ASiDunMaDing.png\"}},{\"brand\":{\"brand\":\"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6\",\"firstletter\":\"A\",\"id\":6,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png\"}}]#[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"}},{\"brand\":{\"brand\":\"%E5%B7%B4%E5%8D%9A%E6%96%AF\",\"firstletter\":\"B\",\"id\":8,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png\"}}]",
  "recommend": "0",
  "scatename1": '@ctitle(3, 10)',   // 所有页面的服务大类名
  "scatename2": '@ctitle(3, 10)',   // 所有页面的服务子类名
  "servercateid": 14,
  "serverid": '@id',
  'status|0-1': 0,
  "storeid": '@id'
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
router.post('/product/server/category', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});

/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/product/server/attrsku', function (req, res, next) {
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
 * 保存服务基本信息
 */
router.post('/product/server/saveServer', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": generateJSON({
      "serverid": '@id'
    }, 1).data[0].serverid,
    "status": "0"
  });
});
/**
 * 保存服务报价
 */
router.post('/product/server/saveOfferprice', function (req, res, next) {
  req.query.motorbrandids.pop();
  var motorbrandids = "[";
  req.query.motorbrandids.forEach(function(item){
    motorbrandids+= JSON.stringify(JSON.parse(item)) + ",";
  });
  motorbrandids += "]";
  res.json({
    "data": generateJSON({
      "serverid": req.query.serverid,
      "motorbrandids": motorbrandids,
      "productcost": req.query.productcost,
      "psku": "[]",
      "saleprice": req.query.saleprice,
      "status": req.query.status,
      "warranty": req.query.warranty,
      "guid": '@id',
      "offerid": '@id'
    }, 1).data[0],
    "status": "0"
  });
});
/**
 * 保存服务报价
 */
router.post('/product/server/saveProduct', function (req, res, next) {
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 编辑商品
 */
router.post('/product/server/edit', function (req, res, next) {
  console.log(req.query.skuid);

  var data = _.find(goods.data, {serverid: req.query.serverid});
  res.json({
    "data": {"skuList":[{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}],"server":{"abstracts":"asdasd爱的十大阿萨德","audit":"0","cateid":2,"catename":"保养","guid":801397394515197952,"motorbrandids":"[{\"brand\":{\"brand\":\"%E5%AE%9D%E9%AA%8F\",\"firstletter\":\"B\",\"id\":9,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png\"}},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\"}}]#[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"},\"series\":[{\"id\":38,\"brandid\":7,\"series\":\"%E5%A5%A5%E8%BF%AAA4\"}]},{\"brand\":{\"brand\":\"%E5%A5%94%E9%A9%B0\",\"firstletter\":\"B\",\"id\":20,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png\"},\"series\":[{\"id\":214,\"brandid\":20,\"series\":\"%E5%A5%94%E9%A9%B0E%E7%BA%A7(%E8%BF%9B%E5%8F%A3)\"}]}]#[{\"brand\":{\"brand\":\"%E9%98%BF%E6%96%AF%E9%A1%BF%C2%B7%E9%A9%AC%E4%B8%81\",\"firstletter\":\"A\",\"id\":5,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_ASiDunMaDing.png\"}},{\"brand\":{\"brand\":\"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6\",\"firstletter\":\"A\",\"id\":6,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png\"}}]#[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"}},{\"brand\":{\"brand\":\"%E5%B7%B4%E5%8D%9A%E6%96%AF\",\"firstletter\":\"B\",\"id\":8,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png\"}}]","recommend":"0","servercateid":14,"serverid":"801397394515197952","servername":"机油更换","status":"1","storeid":1},"offerList":[{"createtime":1479830400000,"groupprice":0,"guid":801397400173326336,"motorbrandids":"[{\"brand\":{\"brand\":\"%E5%AE%9D%E9%AA%8F\",\"firstletter\":\"B\",\"id\":9,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png\"}},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\"}}]","productcost":0,"pskuids":"798836069972865024,798835425861988352","saleprice":1,"serverid":"801397394515197952","servernum":0,"status":"1","warranty":12},{"createtime":1479830400000,"groupprice":0,"guid":801397400198492160,"motorbrandids":"[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"},\"series\":[{\"id\":38,\"brandid\":7,\"series\":\"%E5%A5%A5%E8%BF%AAA4\"}]},{\"brand\":{\"brand\":\"%E5%A5%94%E9%A9%B0\",\"firstletter\":\"B\",\"id\":20,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png\"},\"series\":[{\"id\":214,\"brandid\":20,\"series\":\"%E5%A5%94%E9%A9%B0E%E7%BA%A7(%E8%BF%9B%E5%8F%A3)\"}]}]","productcost":0,"pskuids":"798847004779245568,798835669043539968","saleprice":2,"serverid":"801397394515197952","servernum":0,"status":"1","warranty":12},{"createtime":1479916800000,"groupprice":0,"guid":801687983269916672,"motorbrandids":"[{\"brand\":{\"brand\":\"%E9%98%BF%E6%96%AF%E9%A1%BF%C2%B7%E9%A9%AC%E4%B8%81\",\"firstletter\":\"A\",\"id\":5,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_ASiDunMaDing.png\"}},{\"brand\":{\"brand\":\"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6\",\"firstletter\":\"A\",\"id\":6,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png\"}}]","productcost":0,"pskuids":"[]","saleprice":1,"serverid":"801397394515197952","servernum":0,"status":"1","warranty":12},{"createtime":1479916800000,"groupprice":0,"guid":801687983303471104,"motorbrandids":"[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\"}},{\"brand\":{\"brand\":\"%E5%B7%B4%E5%8D%9A%E6%96%AF\",\"firstletter\":\"B\",\"id\":8,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png\"}}]","productcost":0,"pskuids":"[]","saleprice":2,"serverid":"801397394515197952","servernum":0,"status":"0","offerid":"1111","warranty":12}]},
    "status": "0"
  });
});


/**
 * 删除商品
 */
router.post('/product/server/remove', function (req, res, next) {
  console.log(req.query.serverid);
  _.remove(goods.data, {serverid: req.query.serverid});
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/server/putupserver', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {serverid: req.query.serverid});
  goods.data[index].status = 1;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品下架
 */
router.post('/product/server/putdownserver', function (req, res, next) {
  console.log(req.query.serverid);

  var index = _.findIndex(goods.data, {serverid: req.query.serverid});
  goods.data[index].status = 0;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/server/putupofferprice', function (req, res, next) {
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/server/putdownofferprice', function (req, res, next) {
  console.log(req.query.productid);
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/server/offerprice', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {serverid: req.query.serverid});
  goods.data[index].status = 1;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 删除报价
 */
router.post('/product/server/removeprice', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {serverid: req.query.serverid});
  goods.data[index].status = 1;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 管理商品（获得全部的商品SKU列表）
 */
router.post('/product/server/allpskulist', function (req, res, next) {
  res.json({
    "data": generateJSON({
      "abstracts": '@ctitle(1, 30)',
      "attrvalues": "1",
      'productid': '@id',
      "guid": '@id',
      'pskuid': '@id',
      'pcateid1': '@natural(10, 30)',
      'pcateid2': '@natural(10, 30)',
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
      'motobrandids': "[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AA\",\"isChecked\":false},\"series\":[{\"id\":39,\"seriesid\":39,\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6\",\"series\":\"%E5%A5%A5%E8%BF%AAA6\",\"isChecked\":false}],\"year\":[{\"id\":70,\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"seriesid\":39,\"series\":\"%E5%A5%A5%E8%BF%AAA6\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004\",\"isChecked\":false}],\"output\":[{\"id\":21,\"brandid\":7,\"seriesid\":39,\"outputid\":21,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%201.8T\",\"output\":\"1.8T\",\"isChecked\":true},{\"id\":32,\"brandid\":7,\"seriesid\":39,\"outputid\":32,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%202.4L\",\"output\":\"2.4L\",\"isChecked\":true}],\"model\":[{\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"gearid\":8,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"model\":\"%E5%A5%A5%E8%BF%AAA6%202004%E6%AC%BE%201.8T%20%E8%87%AA%E5%8A%A8%E5%9F%BA%E6%9C%AC\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%E6%AC%BE%201.8T%20%E8%87%AA%E5%8A%A8%E5%9F%BA%E6%9C%AC\",\"outputid\":21,\"seriesid\":39,\"structid\":3,\"year\":\"2004\"}]},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC\",\"isChecked\":false},\"series\":[{\"id\":100,\"seriesid\":100,\"brandid\":11,\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"series\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"isChecked\":false}],\"year\":[{\"id\":185,\"brandid\":11,\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"seriesid\":100,\"series\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"year\":\"2016\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB%202016\",\"isChecked\":true}]},{\"brand\":{\"brand\":\"%E5%A5%94%E9%A9%B0\",\"firstletter\":\"B\",\"id\":20,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png\",\"title\":\"%E5%A5%94%E9%A9%B0\",\"isChecked\":true}}]",
      'unit|1': [
        "个", "桶", "毫米", "公斤", "件"
      ],
      'officialprice': _.random(0.00, 999.99).toFixed(2),
      'saleprice': _.random(0.00, 999.99).toFixed(2),
      'stock': _.random(0, 999),
      'skuvalues': '[{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}]',
      "transid": 1,
      "transname": "中通快递",
      "updatetime": '@date("yyyy-MM-dd HH:mm:ss")',
      "audit": "0",
      "benefitprice": _.random(0.00, 999.99).toFixed(2),
      "costprice": 0,
      "createtime": '@date("yyyy-MM-dd HH:mm:ss")',
      "emsfee": 0,
      "expressfee": 0,
      "groupprice": 0,
      "integral": 0,
      "mailfee": 0,
      "parentcatename": "机油",
      "recommend": "0",
      "skusalenum": 0,
      "specialprice": 0,
      "storeid": 1,
      "tradeprice": 0,
      "cnname": '@ctitle(3, 10)',
      "pcatename1": '@ctitle(3, 10)',
      "pcatename2": '@ctitle(2, 7)'
    }, 100).data,
    "status": "0"
  });
});

/**
 * 管理商品（获得全部的商品SKU列表）
 */
router.post('/product/server/pskulist', function (req, res, next) {
  res.json({
    "data": generateJSON({
      "abstracts": '@ctitle(1, 30)',
      "attrvalues": "1",
      'productid': '@id',
      "guid": '@id',
      'pskuid': '@id',
      'pcateid1': '@natural(10, 30)',
      'pcateid2': '@natural(10, 30)',
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
      "numbers": 1,
      'status|0-1': 0,
      'productname': '@ctitle(10, 40)',
      'motobrandids': "[{\"brand\":{\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"id\":7,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AA\",\"isChecked\":false},\"series\":[{\"id\":39,\"seriesid\":39,\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6\",\"series\":\"%E5%A5%A5%E8%BF%AAA6\",\"isChecked\":false}],\"year\":[{\"id\":70,\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"seriesid\":39,\"series\":\"%E5%A5%A5%E8%BF%AAA6\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004\",\"isChecked\":false}],\"output\":[{\"id\":21,\"brandid\":7,\"seriesid\":39,\"outputid\":21,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%201.8T\",\"output\":\"1.8T\",\"isChecked\":true},{\"id\":32,\"brandid\":7,\"seriesid\":39,\"outputid\":32,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"year\":\"2004\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%202.4L\",\"output\":\"2.4L\",\"isChecked\":true}],\"model\":[{\"brandid\":7,\"brand\":\"%E5%A5%A5%E8%BF%AA\",\"firstletter\":\"A\",\"gearid\":8,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png\",\"model\":\"%E5%A5%A5%E8%BF%AAA6%202004%E6%AC%BE%201.8T%20%E8%87%AA%E5%8A%A8%E5%9F%BA%E6%9C%AC\",\"title\":\"%E5%A5%A5%E8%BF%AAA6%202004%E6%AC%BE%201.8T%20%E8%87%AA%E5%8A%A8%E5%9F%BA%E6%9C%AC\",\"outputid\":21,\"seriesid\":39,\"structid\":3,\"year\":\"2004\"}]},{\"brand\":{\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"id\":11,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC\",\"isChecked\":false},\"series\":[{\"id\":100,\"seriesid\":100,\"brandid\":11,\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"series\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"isChecked\":false}],\"year\":[{\"id\":185,\"brandid\":11,\"brand\":\"%E5%AE%9D%E9%A9%AC\",\"firstletter\":\"B\",\"seriesid\":100,\"series\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB\",\"year\":\"2016\",\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png\",\"title\":\"%E5%AE%9D%E9%A9%AC3%E7%B3%BB%202016\",\"isChecked\":true}]},{\"brand\":{\"brand\":\"%E5%A5%94%E9%A9%B0\",\"firstletter\":\"B\",\"id\":20,\"logo\":\"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png\",\"title\":\"%E5%A5%94%E9%A9%B0\",\"isChecked\":true}}]",
      'unit|1': [
        "个", "桶", "毫米", "公斤", "件"
      ],
      'officialprice': _.random(0.00, 999.99).toFixed(2),
      'saleprice': _.random(0.00, 999.99).toFixed(2),
      'stock': _.random(0, 999),
      'skuvalues': '[{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}]',
      "transid": 1,
      "transname": "中通快递",
      "updatetime": '@date("yyyy-MM-dd HH:mm:ss")',
      "audit": "0",
      "benefitprice": _.random(0.00, 999.99).toFixed(2),
      "costprice": 0,
      "createtime": '@date("yyyy-MM-dd HH:mm:ss")',
      "emsfee": 0,
      "expressfee": 0,
      "groupprice": 0,
      "integral": 0,
      "mailfee": 0,
      "parentcatename": "机油",
      "recommend": "0",
      "skusalenum": 0,
      "specialprice": 0,
      "storeid": 1,
      "tradeprice": 0,
      "cnname": '@ctitle(3, 10)',
      "pcatename1": '@ctitle(3, 10)',
      "pcatename2": '@ctitle(2, 7)'
    }, 5).data,
    "status": "0"
  });
});

module.exports = router;
