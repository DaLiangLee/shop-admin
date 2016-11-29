/**
 * Created by Administrator on 2016/11/22.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

/**
 * 获取相关数据
 */
const brand = require('./../data/cb_motor_brand.json').RECORDS;
const series = require('./../data/cb_motor_series.json').RECORDS;
const year = require('./../data/cb_motor_year.json').RECORDS;
const output = require('./../data/cb_motor_output.json').RECORDS;
const modle = require('./../data/cb_motor_all.json').RECORDS;

/**
 * 获取车辆品牌列表
 */
router.post('/motor/brand', function (req, res, next) {
  res.json({
    "status":0,
    "data": brand
  });
});

/**
 * 获取车系列表
 */
router.post('/motor/series', function (req, res, next) {
  var data = _.filter(series, function(item){
    return item.brandid == req.query.brandid;
  });
  res.json({
    "data": data,
    "status": "0"
  });
});


/**
 * 获取年份列表
 */
router.post('/motor/year', function (req, res, next) {
  var data = _.filter(year, function(item){
    return item.brandid == req.query.brandid && item.seriesid == req.query.seriesid;
  });
  res.json({
    "data": data,
    "status": "0"
  });
});

/**
 * 获取排量列表
 */
router.post('/motor/output', function (req, res, next) {
  var items = _.filter(modle, function(item){
    return item.brandid == req.query.brandid && item.seriesid == req.query.seriesid && item.year == req.query.year;
  });
  var data = [];
  items.forEach(function(key){
    var value = _.find(output, function(item){
      return item.id == key.outputid;
    });
    value.year = req.query.year;
    data.push(value);
  });
  res.json({
    "data": _.uniq(data, 'id'),
    "status": "0"
  });
});

/**
 * 获取型号列表
 */
router.post('/motor/model', function (req, res, next) {
  var data = _.filter(modle, function(item){
    return item.brandid == req.query.brandid && item.seriesid == req.query.seriesid && item.year == req.query.year && item.outputid == req.query.outputid;
  });
  res.json({
    "data": data,
    "status": "0"
  });
});

module.exports = router;
