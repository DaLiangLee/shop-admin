/**
 * Created by Administrator on 2016/11/2.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const generateJSON = require('./../generate');

const phone = /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/;

const DEFAULT_DATA = generateJSON({
  'id|+1': 0,
  'name': '@cname',
  'account': phone,
  'status|0-1': 0,
  'rolename|0-10': 0
}, 30);

var UID = 30;

var employee = DEFAULT_DATA.data.concat([]);

router.get('/member/employee', function (req, res, next) {
  var data = employee.concat([]);
  /**
   * filter
   */
  req.body.name && (data = _.filter(data, function(item) {
    return  _.startsWith(item.name, req.body.name);
  }));
  req.body.account && (data = _.filter(data, function(item) {
    return  _.startsWith(item.account, req.body.account*1);
  }));
  req.body.status && (data = _.filter(data, function(item) {
    return  _.startsWith(item.status, req.body.status*1);
  }));
  req.body.rolename && (data = _.filter(data, function(item) {
    return  _.startsWith(item.rolename, req.body.rolename*1);
  }));
  /**
   * 获取当前页
   * @type {any}
   */
  var page = req.query.page || 1;
  /**
   * 获取当前列表长度
   * @type {any}
   */
  var total = data ? data.length : 0;
  /**
   * 模拟分页
   * @type {any}
   */
  data = _.chunk(data, 10)[page*1 - 1] || [];

  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});

router.post('/member/employee/add', function (req, res, next) {
  var data = {
    'id': UID++,
    'name': req.query.name,
    'account': req.query.account,
    'status': 0,
    'rolename': req.query.rolename*1
  };
  employee.unshift(data);
  res.json({
    "data": "",
    "status": "0"
  });
});

router.post('/member/employee/edit', function (req, res, next) {
  var index = _.findIndex(employee, {'id': req.query.id*1});
  var data = {
    'id': req.query.id*1,
    'name': req.query.name,
    'account': req.query.account,
    'status': req.query.status*1,
    'rolename': req.query.rolename*1
  };
  employee[index] = data;
  res.json({
    "data": "",
    "status": "0"
  });
});

router.post('/member/employee/enable', function (req, res, next) {
  var index = _.findIndex(employee, {'id': req.query.id*1});
  console.log(index, req.query.id*1);

  employee[index].status = 0;
  res.json({
    "data": "",
    "status": "0"
  });
});

router.post('/member/employee/disable', function (req, res, next) {
  var index = _.findIndex(employee, {'id': req.query.id*1});
  employee[index].status = 1;
  console.log(index, req.query.id*1);
  res.json({
    "data": "",
    "status": "0"
  });
});

router.post('/member/employee/remove', function (req, res, next) {
  _.remove(employee, function (item) {
      return item.id == req.query.id*1
  });
  res.json({
    "data": "",
    "status": "0"
  });
});

router.post('/member/employee/reset', function (req, res, next) {
  var index = _.findIndex(employee, {'id': req.query.id*1});
  res.json({
    "data": "",
    "status": "0"
  });
});

module.exports = router;
