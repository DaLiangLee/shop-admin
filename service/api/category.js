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
router.post('/category/storeserver', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": {6:{"catename":"轮胎","id":6,"items":[{"catename":"补胎","id":60,"items":[],"parentid":6,"parentids":"0,1,6","sort":1,"unit":"个"},{"catename":"四轮定位","id":61,"items":[],"parentid":6,"parentids":"0,1,6","sort":2,"unit":"次"},{"catename":"轮胎动平衡","id":62,"items":[],"parentid":6,"parentids":"0,1,6","sort":3,"unit":"次"},{"catename":"轮胎安装","id":63,"items":[],"parentid":6,"parentids":"0,1,6","sort":4,"unit":"个"},{"catename":"轮毂更换","id":64,"items":[],"parentid":6,"parentids":"0,1,6","sort":5,"unit":"个"},{"catename":"轮胎对调","id":65,"items":[],"parentid":6,"parentids":"0,1,6","sort":6,"unit":"次"},{"catename":"其他","id":66,"items":[],"parentid":6,"parentids":"0,1,6","sort":7,"unit":"次"}],"parentid":1,"parentids":"0,1","sort":6},5:{"catename":"维修","id":5,"items":[{"catename":"全车检测","id":55,"items":[],"parentid":5,"parentids":"0,1,5","sort":1,"unit":"次"},{"catename":"喇叭更换","id":56,"items":[],"parentid":5,"parentids":"0,1,5","sort":2,"unit":"个"},{"catename":"车灯更换","id":57,"items":[],"parentid":5,"parentids":"0,1,5","sort":3,"unit":"个"},{"catename":"玻璃修复","id":58,"items":[],"parentid":5,"parentids":"0,1,5","sort":4,"unit":"片"},{"catename":"其他","id":59,"items":[],"parentid":5,"parentids":"0,1,5","sort":5,"unit":"个"}],"parentid":1,"parentids":"0,1","sort":5},7:{"catename":"钣金油漆","id":7,"items":[{"catename":"钣金修复","id":67,"items":[],"parentid":7,"parentids":"0,1,7","sort":1,"unit":"次"},{"catename":"轮毂翻新","id":68,"items":[],"parentid":7,"parentids":"0,1,7","sort":2,"unit":"次"},{"catename":"局部喷漆","id":69,"items":[],"parentid":7,"parentids":"0,1,7","sort":3,"unit":"次"},{"catename":"全车翻新","id":70,"items":[],"parentid":7,"parentids":"0,1,7","sort":4,"unit":"次"},{"catename":"单幅油漆","id":71,"items":[],"parentid":7,"parentids":"0,1,7","sort":5,"unit":"次"},{"catename":"后视镜翻新","id":72,"items":[],"parentid":7,"parentids":"0,1,7","sort":6,"unit":"个"},{"catename":"喷漆","id":73,"items":[],"parentid":7,"parentids":"0,1,7","sort":7,"unit":"次"},{"catename":"车漆修复","id":74,"items":[],"parentid":7,"parentids":"0,1,7","sort":8,"unit":"次"},{"catename":"其他","id":75,"items":[],"parentid":7,"parentids":"0,1,7","sort":9,"unit":"次"}],"parentid":1,"parentids":"0,1","sort":7},2:{"catename":"保养","id":2,"items":[{"catename":"空气滤芯更换","id":8,"items":[],"parentid":2,"parentids":"0,1,2","sort":1,"unit":"个"},{"catename":"空调清洗（空调进气系统）","id":9,"items":[],"parentid":2,"parentids":"0,1,2","sort":2,"unit":"次"},{"catename":"油路清洗","id":10,"items":[],"parentid":2,"parentids":"0,1,2","sort":3,"unit":"次"},{"catename":"空调滤芯更换","id":11,"items":[],"parentid":2,"parentids":"0,1,2","sort":4,"unit":"个"},{"catename":"前刹车片更换","id":12,"items":[],"parentid":2,"parentids":"0,1,2","sort":5,"unit":"个"},{"catename":"后刹车片更换","id":13,"items":[],"parentid":2,"parentids":"0,1,2","sort":6,"unit":"个"},{"catename":"机油更换","id":14,"items":[],"parentid":2,"parentids":"0,1,2","sort":7,"unit":"升"},{"catename":"刹车油更换","id":15,"items":[],"parentid":2,"parentids":"0,1,2","sort":8,"unit":"升"},{"catename":"更换/添加防冻液","id":16,"items":[],"parentid":2,"parentids":"0,1,2","sort":9,"unit":"升"},{"catename":"变速箱保养","id":17,"items":[],"parentid":2,"parentids":"0,1,2","sort":10,"unit":"次"},{"catename":"节气门清洗","id":18,"items":[],"parentid":2,"parentids":"0,1,2","sort":11,"unit":"次"},{"catename":"雨刮器更换","id":19,"items":[],"parentid":2,"parentids":"0,1,2","sort":12,"unit":"个"},{"catename":"灯泡更换","id":20,"items":[],"parentid":2,"parentids":"0,1,2","sort":13,"unit":"个"},{"catename":"刹车系统维护","id":21,"items":[],"parentid":2,"parentids":"0,1,2","sort":14,"unit":"次"},{"catename":"燃油滤清更换","id":22,"items":[],"parentid":2,"parentids":"0,1,2","sort":15,"unit":"毫升"},{"catename":"喷油嘴清洗","id":23,"items":[],"parentid":2,"parentids":"0,1,2","sort":16,"unit":"次"},{"catename":"三元催化器清洗","id":24,"items":[],"parentid":2,"parentids":"0,1,2","sort":17,"unit":"次"},{"catename":"火花塞更换","id":25,"items":[],"parentid":2,"parentids":"0,1,2","sort":18,"unit":"个"},{"catename":"变速箱（波箱）油更换","id":26,"items":[],"parentid":2,"parentids":"0,1,2","sort":19,"unit":"个"},{"catename":"减震（避震）更换","id":27,"items":[],"parentid":2,"parentids":"0,1,2","sort":20,"unit":"个"},{"catename":"转向液更换","id":28,"items":[],"parentid":2,"parentids":"0,1,2","sort":21,"unit":"毫升"},{"catename":"外部皮带更换","id":29,"items":[],"parentid":2,"parentids":"0,1,2","sort":22,"unit":"条"},{"catename":"蓄电池更换","id":30,"items":[],"parentid":2,"parentids":"0,1,2","sort":23,"unit":"个"},{"catename":"其他","id":31,"items":[],"parentid":2,"parentids":"0,1,2","sort":24,"unit":"次"}],"parentid":1,"parentids":"0,1","sort":2},3:{"catename":"洗车","id":3,"items":[{"catename":"人工普洗","id":32,"items":[],"parentid":3,"parentids":"0,1,3","sort":1,"unit":"次"},{"catename":"人工精洗","id":33,"items":[],"parentid":3,"parentids":"0,1,3","sort":2,"unit":"次"},{"catename":"电脑洗车","id":34,"items":[],"parentid":3,"parentids":"0,1,3","sort":3,"unit":"次"},{"catename":"其他","id":35,"items":[],"parentid":3,"parentids":"0,1,3","sort":4,"unit":"次"}],"parentid":1,"parentids":"0,1","sort":3},4:{"catename":"美容","id":4,"items":[{"catename":"抛光","id":36,"items":[],"parentid":4,"parentids":"0,1,4","sort":1,"unit":"次"},{"catename":"内部清洗","id":37,"items":[],"parentid":4,"parentids":"0,1,4","sort":2,"unit":"次"},{"catename":"发动机舱清洗","id":38,"items":[],"parentid":4,"parentids":"0,1,4","sort":3,"unit":"次"},{"catename":"全车镀晶","id":39,"items":[],"parentid":4,"parentids":"0,1,4","sort":4,"unit":"次"},{"catename":"玻璃护理","id":40,"items":[],"parentid":4,"parentids":"0,1,4","sort":5,"unit":"次"},{"catename":"汽车大灯翻新","id":41,"items":[],"parentid":4,"parentids":"0,1,4","sort":6,"unit":"个"},{"catename":"空调消毒/清洗","id":42,"items":[],"parentid":4,"parentids":"0,1,4","sort":7,"unit":"次"},{"catename":"天花干洗","id":43,"items":[],"parentid":4,"parentids":"0,1,4","sort":8,"unit":"次"},{"catename":"座椅清洗","id":44,"items":[],"parentid":4,"parentids":"0,1,4","sort":9,"unit":"次"},{"catename":"地毯干洗","id":45,"items":[],"parentid":4,"parentids":"0,1,4","sort":10,"unit":"次"},{"catename":"仪表板清洗","id":46,"items":[],"parentid":4,"parentids":"0,1,4","sort":11,"unit":"次"},{"catename":"座椅包真皮","id":47,"items":[],"parentid":4,"parentids":"0,1,4","sort":12,"unit":"次"},{"catename":"打蜡","id":48,"items":[],"parentid":4,"parentids":"0,1,4","sort":13,"unit":"次"},{"catename":"封釉","id":49,"items":[],"parentid":4,"parentids":"0,1,4","sort":14,"unit":"次"},{"catename":"底盘装甲","id":50,"items":[],"parentid":4,"parentids":"0,1,4","sort":15,"unit":"次"},{"catename":"玻璃贴膜","id":51,"items":[],"parentid":4,"parentids":"0,1,4","sort":16,"unit":"套"},{"catename":"镀膜","id":52,"items":[],"parentid":4,"parentids":"0,1,4","sort":17,"unit":"套"},{"catename":"音响改装","id":53,"items":[],"parentid":4,"parentids":"0,1,4","sort":18,"unit":"对"},{"catename":"其他","id":54,"items":[],"parentid":4,"parentids":"0,1,4","sort":19,"unit":"次"}],"parentid":1,"parentids":"0,1","sort":4}},
    "status": "0"
  });
});


module.exports = router;