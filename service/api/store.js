/**
 * Created by Administrator on 2016/11/3.
 */
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const telephone = /(^400[0-9]{7})|(^800[0-9]{7})|(^1(3|4|7|5|8)([0-9]{9}))|(^0[0-9]{2,3}-[0-9]{8})/;
const generateJSON = require('./../generate');

var home = generateJSON({
  'id': '@id',
  'shopname': '@ctitle(10, 20)',
  'address': '@county(true)',
  'hours': {
    'start': "@now('day', 'HH:mm')",
    'end': "@now('day', 'HH:mm')"
  },
  'status|0-1': 0,
  'scope': [
    {
      'id': 0,
      'name': '维修',
      'status|0-1': 0
    },
    {
      'id': 1,
      'name': '保养',
      'status|0-1': 0
    },
    {
      'id': 2,
      'name': '洗车',
      'status|0-1': 0
    },
    {
      'id': 3,
      'name': '美容',
      'status|0-1': 0
    },
    {
      'id': 4,
      'name': '轮胎',
      'status|0-1': 0
    }
  ],
  'telephone': telephone,
  'legaler': '@cname()',
  'qrcode': "@image('258x258', '#894FC4', '#FFF', 'png', 'qrcode')",
  'photos|1-4': [
    "@image('240x130', '#4A7BF7', '#FFF', 'png')"
  ],
  'description': '@ctitle(300, 350)'
}, 1);

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
router.post('/store/shop/edit', function (req, res, next) {
  res.json({
    "data": "",
    "status": "0"
  });
});

module.exports = router;
