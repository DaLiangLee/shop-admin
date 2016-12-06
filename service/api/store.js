/**
 * Created by Administrator on 2016/11/3.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

var manager = {"accountList":[{"accountkey":"1111111111111111","accountname":"萨达","atypeid":0,"bankfullname":"中国工商银行藏龙岛支行","bankid":1,"createtime":1480994937000,"ctypeid":0,"guid":1,"paysignkey":"0","poundage":0,"ptypeid":0,"rate":0,"remak":"","storeid":802335146085724160,"stypeid":0}],"allonelevel":[{"catename":"保养","id":2,"items":[],"parentid":1,"parentids":"0,1","sort":2},{"catename":"洗车","id":3,"items":[],"parentid":1,"parentids":"0,1","sort":3},{"catename":"美容","id":4,"items":[],"parentid":1,"parentids":"0,1","sort":4},{"catename":"维修","id":5,"items":[],"parentid":1,"parentids":"0,1","sort":5},{"catename":"轮胎","id":6,"items":[],"parentid":1,"parentids":"0,1","sort":6},{"catename":"钣金油漆","id":7,"items":[],"parentid":1,"parentids":"0,1","sort":7}],"store":{"address":"123","areaid":130103,"audit":"1","banner":"","classid":0,"closetime":"0","createtime":1480126663000,"description":"sadasdasd","gradeid":0,"guid":802335146085724160,"latitude":0,"license":"http://audit-oss-chebian.oss-cn-shenzhen.aliyuncs.com/802332314272022500_CARD2,http://audit-oss-chebian.oss-cn-shenzhen.aliyuncs.com/802332314272022500_CARD3,http://audit-oss-chebian.oss-cn-shenzhen.aliyuncs.com/802332314272022500_BIZ1","logo":"","longitude":0,"opentime":"0","ownername":"123","parentid":0,"parentids":"0","pcategorys":"null","photos":"http://show-oss-chebian.oss-cn-shenzhen.aliyuncs.com/store-details/802332314272022500_CASE3,http://show-oss-chebian.oss-cn-shenzhen.aliyuncs.com/store-details/802332314272022500_CASE4,http://show-oss-chebian.oss-cn-shenzhen.aliyuncs.com/store-details/802332314272022500_CASE5","recommend":"0","regname":"123","scategorys":"2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,39,40,62,63,67,68,69,70,71,72,73,74,75","status":"0","storename":"123","telephone":"13886022473","violation":"1"},"selectedonelevel":[{"catename":"保养","id":2,"items":[],"parentid":1,"parentids":"0,1","sort":2},{"catename":"洗车","id":3,"items":[],"parentid":1,"parentids":"0,1","sort":3},{"catename":"美容","id":4,"items":[],"parentid":1,"parentids":"0,1","sort":4},{"catename":"轮胎","id":6,"items":[],"parentid":1,"parentids":"0,1","sort":6},{"catename":"钣金油漆","id":7,"items":[],"parentid":1,"parentids":"0,1","sort":7}]};
/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/store/shop/manager', function (req, res, next) {
  res.json({
    "data": manager,
    "status": "0"
  });
});
/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/store/shop/saveTime', function (req, res, next) {
  console.log(req.query);
  manager.opentime = req.query.opentime;
  manager.closetime = req.query.closetime;
  res.json({
    "data": "",
    "status": "0"
  });
});
/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/store/shop/saveTelephone', function (req, res, next) {
  console.log(req.query);
  manager.telephone = req.query.telephone;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/store/shop/savePhotos', function (req, res, next) {
  console.log(req.query);
  manager.photos = req.query.photos;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/store/shop/saveDescription', function (req, res, next) {
  console.log(req.query);
  manager.description = req.query.description;
  res.json({
    "data": "",
    "status": "0"
  });
});


module.exports = router;
