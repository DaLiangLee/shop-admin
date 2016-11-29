/**
 * Created by Administrator on 2016/11/22.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const brand = require('./../data/cb_motor_brand.json').RECORDS;
/*
const motor = require('./../data/cb_motor_all.json').RECORDS;
const motor = require('./../data/cb_motor_all.json').RECORDS;
const motor = require('./../data/cb_motor_all.json').RECORDS;
*/
//const motor = require('./../data/cb_motor_all.json').RECORDS;


console.log(brand.length);


/**
 * 获取车辆品牌列表
 */
/*router.post('/motor/brand', function (req, res, next) {
  res.json({
    "status":0,
    "data": brand
  });
});*/


router.post('/motor/brand', function (req, res, next) {

  res.json({
    "status":0,
    "data": brand
  });
});
const series = {
  '1': [
    {"id": 1, "brandid": 1, "series": "AC Schnitzer 7系"},
    {"id": 2, "brandid": 1, "series": "AC Schnitzer X5"},
    {"id": 3, "brandid": 1, "series": "AC Schnitzer X6"}
  ],
  "4": [
    {"id": 5, "brandid": 4, "series": "ALFA 4C"},
    {"id": 6, "brandid": 4, "series": "Disco Volante"},
    {"id": 7, "brandid": 4, "series": "Giulia"},
    {"id": 8, "brandid": 4, "series": "Giulietta"},
    {"id": 9, "brandid": 4, "series": "Gloria"},
    {"id": 10, "brandid": 4, "series": "MiTo"},
    {"id": 11, "brandid": 4, "series": "ALFA 147"},
    {"id": 12, "brandid": 4, "series": "ALFA 156"},
    {"id": 13, "brandid": 4, "series": "ALFA 159"},
    {"id": 14, "brandid": 4, "series": "ALFA 8C"},
    {"id": 15, "brandid": 4, "series": "ALFA GT"}
  ],
  "5": [ { id: '16', brandid: '5', series: 'Cygnet' },
    { id: '17', brandid: '5', series: 'Rapide' },
    { id: '18', brandid: '5', series: 'V12 Vantage' },
    { id: '19', brandid: '5', series: 'V8 Vantage' },
    { id: '20', brandid: '5', series: 'Vanquish' },
    { id: '21', brandid: '5', series: 'Virage' },
    { id: '22', brandid: '5', series: 'Vulcan' },
    { id: '23', brandid: '5', series: '阿斯顿·马丁DB10' },
    { id: '24', brandid: '5', series: '阿斯顿·马丁DB11' },
    { id: '25', brandid: '5', series: '阿斯顿·马丁DB5' },
    { id: '26', brandid: '5', series: '阿斯顿·马丁DB9' },
    { id: '27', brandid: '5', series: '阿斯顿·马丁DBX' },
    { id: '28', brandid: '5', series: '拉共达Taraf' },
    { id: '29', brandid: '5', series: 'V12 Zagato' },
    { id: '30', brandid: '5', series: '阿斯顿·马丁DBS' },
    { id: '31', brandid: '5', series: '阿斯顿·马丁One-77' } ],
  "6": [ { id: '32', brandid: '6', series: '宝斯通' } ],
  "7": [ { id: '33', brandid: '7', series: '奥迪A3' },
    { id: '34', brandid: '7', series: '奥迪A4L' },
    { id: '35', brandid: '7', series: '奥迪A6L' },
    { id: '36', brandid: '7', series: '奥迪Q3' },
    { id: '37', brandid: '7', series: '奥迪Q5' },
    { id: '38', brandid: '7', series: '奥迪A4' },
    { id: '39', brandid: '7', series: '奥迪A6' },
    { id: '40', brandid: '7', series: 'allroad' },
    { id: '41', brandid: '7', series: 'Crosslane Coupe' },
    { id: '42', brandid: '7', series: 'e-tron quattro' },
    { id: '43', brandid: '7', series: 'Nanuk' },
    { id: '44', brandid: '7', series: 'Prologue' },
    { id: '45', brandid: '7', series: 'quattro' },
    { id: '46', brandid: '7', series: '奥迪A1' },
    { id: '47', brandid: '7', series: '奥迪A2' },
    { id: '48', brandid: '7', series: '奥迪A3[进口)' },
    { id: '49', brandid: '7', series: '奥迪A4[进口)' },
    { id: '50', brandid: '7', series: '奥迪A5' },
    { id: '51', brandid: '7', series: '奥迪A6[进口)' },
    { id: '52', brandid: '7', series: '奥迪A7' },
    { id: '53', brandid: '7', series: '奥迪A8' },
    { id: '54', brandid: '7', series: '奥迪e-tron' },
    { id: '55', brandid: '7', series: '奥迪Q2' },
    { id: '56', brandid: '7', series: '奥迪Q3[进口)' },
    { id: '57', brandid: '7', series: '奥迪Q5[进口)' },
    { id: '58', brandid: '7', series: '奥迪Q7' },
    { id: '59', brandid: '7', series: '奥迪R18' },
    { id: '60', brandid: '7', series: '奥迪R8' },
    { id: '61', brandid: '7', series: '奥迪S1' },
    { id: '62', brandid: '7', series: '奥迪S3' },
    { id: '63', brandid: '7', series: '奥迪S4' },
    { id: '64', brandid: '7', series: '奥迪S5' },
    { id: '65', brandid: '7', series: '奥迪S6' },
    { id: '66', brandid: '7', series: '奥迪S7' },
    { id: '67', brandid: '7', series: '奥迪S8' },
    { id: '68', brandid: '7', series: '奥迪SQ5' },
    { id: '69', brandid: '7', series: '奥迪SQ7' },
    { id: '70', brandid: '7', series: '奥迪TT' },
    { id: '71', brandid: '7', series: '奥迪TT offroad' },
    { id: '72', brandid: '7', series: '奥迪TTS' },
    { id: '73', brandid: '7', series: '奥迪100' },
    { id: '74', brandid: '7', series: '奥迪Cross' },
    { id: '75', brandid: '7', series: '奥迪Urban' },
    { id: '76', brandid: '7', series: '奥迪RS 3' },
    { id: '77', brandid: '7', series: '奥迪RS 4' },
    { id: '78', brandid: '7', series: '奥迪RS 5' },
    { id: '79', brandid: '7', series: '奥迪RS 6' },
    { id: '80', brandid: '7', series: '奥迪RS 7' },
    { id: '81', brandid: '7', series: '奥迪RS Q3' },
    { id: '82', brandid: '7', series: '奥迪TT RS' } ],
  "8": [ { id: '83', brandid: '8', series: '巴博斯 CLS级' },
    { id: '84', brandid: '8', series: '巴博斯 E级' },
    { id: '85', brandid: '8', series: '巴博斯 GL级' },
    { id: '86', brandid: '8', series: '巴博斯 G级' },
    { id: '87', brandid: '8', series: '巴博斯 M级' },
    { id: '88', brandid: '8', series: '巴博斯 SLK级' },
    { id: '89', brandid: '8', series: '巴博斯 SLS级' },
    { id: '90', brandid: '8', series: '巴博斯 SL级' },
    { id: '91', brandid: '8', series: '巴博斯 smart fortwo' },
    { id: '92', brandid: '8', series: '巴博斯 S级' } ],
  "11": [ { id: '99', brandid: '11', series: '宝马2系旅行车' },
    { id: '100', brandid: '11', series: '宝马3系' },
    { id: '101', brandid: '11', series: '宝马5系' },
    { id: '102', brandid: '11', series: '宝马X1' },
    { id: '103', brandid: '11', series: '3.0 CSL Hommage' },
    { id: '104', brandid: '11', series: 'Compact Sedan' },
    { id: '105', brandid: '11', series: 'Gran Lusso' },
    { id: '106', brandid: '11', series: 'Vision Future Luxury' },
    { id: '107', brandid: '11', series: 'Zagato Coupe' },
    { id: '108', brandid: '11', series: '宝马1系' },
    { id: '109', brandid: '11', series: '宝马2系' },
    { id: '110', brandid: '11', series: '宝马2系多功能旅行车' },
    { id: '111', brandid: '11', series: '宝马2系旅行车[进口)' },
    { id: '112', brandid: '11', series: '宝马3系[进口)' },
    { id: '113', brandid: '11', series: '宝马3系GT' },
    { id: '114', brandid: '11', series: '宝马4系' },
    { id: '115', brandid: '11', series: '宝马5系[进口)' },
    { id: '116', brandid: '11', series: '宝马5系GT' },
    { id: '117', brandid: '11', series: '宝马6系' },
    { id: '118', brandid: '11', series: '宝马7系' },
    { id: '119', brandid: '11', series: '宝马i3' },
    { id: '120', brandid: '11', series: '宝马i8' },
    { id: '121', brandid: '11', series: '宝马X1[进口)' },
    { id: '122', brandid: '11', series: '宝马X3' },
    { id: '123', brandid: '11', series: '宝马X4' },
    { id: '124', brandid: '11', series: '宝马X5' },
    { id: '125', brandid: '11', series: '宝马X6' },
    { id: '126', brandid: '11', series: '宝马Z4' },
    { id: '127', brandid: '11', series: 'Active Tourer' },
    { id: '128', brandid: '11', series: 'ConnectedDrive' },
    { id: '129', brandid: '11', series: 'EfficientDynamics' },
    { id: '130', brandid: '11', series: 'Isetta' },
    { id: '131', brandid: '11', series: '宝马8系' },
    { id: '132', brandid: '11', series: '宝马GINA' },
    { id: '133', brandid: '11', series: '宝马Z8' },
    { id: '134', brandid: '11', series: '宝马M2' },
    { id: '135', brandid: '11', series: '宝马M3' },
    { id: '136', brandid: '11', series: '宝马M4' },
    { id: '137', brandid: '11', series: '宝马M5' },
    { id: '138', brandid: '11', series: '宝马M6' },
    { id: '139', brandid: '11', series: '宝马X5 M' },
    { id: '140', brandid: '11', series: '宝马X6 M' },
    { id: '141', brandid: '11', series: '宝马1系M' },
    { id: '142', brandid: '11', series: '宝马M1' } ],
  "13": [ { id: '146', brandid: '13', series: 'Boxster' },
    { id: '147', brandid: '13', series: 'Cayman' },
    { id: '148', brandid: '13', series: 'Macan' },
    { id: '149', brandid: '13', series: 'Mission E' },
    { id: '150', brandid: '13', series: 'Panamera' },
    { id: '151', brandid: '13', series: '保时捷911' },
    { id: '152', brandid: '13', series: '保时捷918' },
    { id: '153', brandid: '13', series: '保时捷919' },
    { id: '154', brandid: '13', series: '卡宴' },
    { id: '155', brandid: '13', series: 'Carrera GT' },
    { id: '156', brandid: '13', series: '保时捷356' },
    { id: '157', brandid: '13', series: '保时捷968' } ],
  "14": [ { id: '158', brandid: '14', series: '北京40' },
    { id: '159', brandid: '14', series: '北京汽车BJ20' },
    { id: '160', brandid: '14', series: '北京汽车BJ80' },
    { id: '161', brandid: '14', series: '北京汽车B90' },
    { id: '162', brandid: '14', series: '北京汽车E系列' } ],
  "17": [ { id: '178', brandid: '17', series: '北汽威旺306' },
    { id: '179', brandid: '17', series: '北汽威旺307' },
    { id: '180', brandid: '17', series: '北汽威旺M20' },
    { id: '181', brandid: '17', series: '北汽威旺M30' },
    { id: '182', brandid: '17', series: '北汽威旺M35' },
    { id: '183', brandid: '17', series: '北汽威旺T205-D' },
    { id: '184', brandid: '17', series: '北汽威旺007' },
    { id: '185', brandid: '17', series: '北汽威旺205' } ],
  "20": [ { id: '196', brandid: '20', series: '奔驰C级' },
    { id: '197', brandid: '20', series: '奔驰E级' },
    { id: '198', brandid: '20', series: '奔驰GLA' },
    { id: '199', brandid: '20', series: '奔驰GLC' },
    { id: '200', brandid: '20', series: '奔驰GLK级' },
    { id: '201', brandid: '20', series: '凌特' },
    { id: '202', brandid: '20', series: '威霆' },
    { id: '203', brandid: '20', series: '唯雅诺' },
    { id: '204', brandid: '20', series: 'Concept IAA' },
    { id: '205', brandid: '20', series: 'Coupe SUV' },
    { id: '206', brandid: '20', series: 'Ener-G-Force' },
    { id: '207', brandid: '20', series: 'Sprinter' },
    { id: '208', brandid: '20', series: '奔驰A级' },
    { id: '209', brandid: '20', series: '奔驰B级' },
    { id: '210', brandid: '20', series: '奔驰CLA级' },
    { id: '211', brandid: '20', series: '奔驰CLS级' },
    { id: '212', brandid: '20', series: '奔驰CSC级' },
    { id: '213', brandid: '20', series: '奔驰C级[进口)' },
    { id: '214', brandid: '20', series: '奔驰E级[进口)' },
    { id: '215', brandid: '20', series: '奔驰F 015' },
    { id: '216', brandid: '20', series: '奔驰F125' },
    { id: '217', brandid: '20', series: '奔驰F800' },
    { id: '218', brandid: '20', series: '奔驰GLA[进口)' },
    { id: '219', brandid: '20', series: '奔驰GLC[进口)' },
    { id: '220', brandid: '20', series: '奔驰GLE' },
    { id: '221', brandid: '20', series: '奔驰GLS' },
    { id: '222', brandid: '20', series: '奔驰GL级' },
    { id: '223', brandid: '20', series: '奔驰G级' },
    { id: '224', brandid: '20', series: '奔驰M级' },
    { id: '225', brandid: '20', series: '奔驰R级' },
    { id: '226', brandid: '20', series: '奔驰SLC' },
    { id: '227', brandid: '20', series: '奔驰SLK级' },
    { id: '228', brandid: '20', series: '奔驰SL级' },
    { id: '229', brandid: '20', series: '奔驰S级' },
    { id: '230', brandid: '20', series: '奔驰V级[进口)' },
    { id: '231', brandid: '20', series: '威霆[进口)' },
    { id: '232', brandid: '20', series: '奔驰CLK级' },
    { id: '233', brandid: '20', series: '奔驰CL级' },
    { id: '234', brandid: '20', series: '奔驰GLK级[进口)' },
    { id: '235', brandid: '20', series: '奔驰SLR级' },
    { id: '236', brandid: '20', series: '唯雅诺[进口)' },
    { id: '237', brandid: '20', series: 'AMG GT' },
    { id: '238', brandid: '20', series: 'Vision' },
    { id: '239', brandid: '20', series: '奔驰A级AMG' },
    { id: '240', brandid: '20', series: '奔驰CLA级AMG' },
    { id: '241', brandid: '20', series: '奔驰CLS级AMG' },
    { id: '242', brandid: '20', series: '奔驰C级AMG' },
    { id: '243', brandid: '20', series: '奔驰E级AMG' },
    { id: '244', brandid: '20', series: '奔驰GLA AMG' },
    { id: '245', brandid: '20', series: '奔驰GLE AMG' },
    { id: '246', brandid: '20', series: '奔驰GLS AMG' },
    { id: '247', brandid: '20', series: '奔驰GL级AMG' },
    { id: '248', brandid: '20', series: '奔驰G级AMG' },
    { id: '249', brandid: '20', series: '奔驰M级AMG' },
    { id: '250', brandid: '20', series: '奔驰SLC AMG' },
    { id: '251', brandid: '20', series: '奔驰SLK级AMG' },
    { id: '252', brandid: '20', series: '奔驰SLS级AMG' },
    { id: '253', brandid: '20', series: '奔驰SL级AMG' },
    { id: '254', brandid: '20', series: '奔驰S级AMG' },
    { id: '255', brandid: '20', series: '奔驰CL级AMG' },
    { id: '256', brandid: '20', series: '迈巴赫S级' } ]
};



/**
 * 获取车系列表
 */
router.post('/motor/series', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": series[req.query.brandid],
    "status": "0"
  });
});


/**
 * 获取年份列表
 */
router.post('/motor/year', function (req, res, next) {
  console.log(req.query);

  res.json({
    "data": [
      {"id": (req.query.brandid+req.query.seriesid)*1+0, "seriesid": req.query.seriesid*1, "year": "2013"},
      {"id": (req.query.brandid+req.query.seriesid)*1+1, "seriesid": req.query.seriesid*1, "year": "2014"},
      {"id": (req.query.brandid+req.query.seriesid)*1+2, "seriesid": req.query.seriesid*1, "year": "2015"},
      {"id": (req.query.brandid+req.query.seriesid)*1+3, "seriesid": req.query.seriesid*1, "year": "2016"}
    ],
    "status": "0"
  });
});

/**
 * 获取排量列表
 */
router.post('/motor/output', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": [
      {"id": (req.query.brandid+req.query.seriesid)*10+0, "year": req.query.year, "output": "2.0T"},
      {"id": (req.query.brandid+req.query.seriesid)*10+1, "year": req.query.year, "output": "2.5T"},
      {"id": (req.query.brandid+req.query.seriesid)*10+2, "year": req.query.year, "output": "3.0T"}
    ],
    "status": "0"
  });
});

const model = {

}

/**
 * 获取型号列表
 */
router.post('/motor/model', function (req, res, next) {
  console.log(req.query);
  const model = _.find(brand, function(item){
    return item.id == req.query.brandid;
  });
  res.json({
    "data": [
      {
      "id": (req.query.brandid+req.query.seriesid+req.query.outputid)*1+1,
      "brandid": req.query.brandid*1,
      "gearid": 23,
      "logo": model.logo,
      "model": model.brand　+ ' 车系' + req.query.seriesid + ' 排量' + req.query.outputid +　' ' +req.query.year + " 运动版",
      "outputid": req.query.outputid*1,
      "seriesid": req.query.seriesid*1,
      "structid": 2,
      "year": req.query.year
      },
      {
        "id": (req.query.brandid+req.query.seriesid+req.query.outputid)*1+2,
        "brandid": req.query.brandid*1,
        "gearid": 23,
        "logo": model.logo,
        "model": model.brand　+ ' 车系' + req.query.seriesid + ' 排量' + req.query.outputid +　' ' + req.query.year + " 限量版",
        "outputid": req.query.outputid*1,
        "seriesid": req.query.seriesid*1,
        "structid": 2,
        "year": req.query.year
      },
      {
        "id": (req.query.brandid+req.query.seriesid+req.query.outputid)*1+3,
        "brandid": req.query.brandid*1,
        "gearid": 23,
        "logo": model.logo,
        "model": model.brand　+ ' 车系' + req.query.seriesid + ' 排量' + req.query.outputid +　' ' + req.query.year + " 青春版",
        "outputid": req.query.outputid*1,
        "seriesid": req.query.seriesid*1,
        "structid": 2,
        "year": req.query.year
      }],
    "status": "0"
  });
});

module.exports = router;
