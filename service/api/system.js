/**
 * Created by Administrator on 2016/10/17.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');



const DEFAULT_DATA = require('./../data/role_data');
var role = require('./../data/role_list');
var UID = 15;


router.get('/system/role', function (req, res, next) {
    var data = role.concat([]);
        //data = data.concat(role,role,role,role,role,role);
    _.forEach(data, function (item) {
        item.list = _.uniq(item.list, true);
        item.list.sort(function (a, b) {
            return a - b;
        });
    });
    if(req.query.name){
        data = _.filter(data, function(item) {
            return  _.startsWith(item.name, req.body.name);
        });
    }
    var page = req.query.page || 1;
    var total = data ? data.length : 0;
    data = _.chunk(data, 10)[page*1 - 1] || [];
    res.json({
        "status": "0",
        "data": data,
        "count": total
    });
});

const roleFilter = {
    "2": "工作台",
    "3": "店铺管理",
    "4": "产品服务",
    "5": "交易管理",
    "6": "财务管理",
    "7": "会员管理",
    "8": "货源中心",
    "9": "雇员管理",
    "10": "系统管理"
}




router.post('/system/role/add', function (req, res, next) {
    var data = {
        "rolename": req.query.rolename,
        "items": addItem(req.query.items),
        "id": UID++,
        "datascope": req.query.datascope
    };
    console.log(req.query);
    role.unshift(data);
    res.json({
        "data": "",
        "status": "0"
    });
});



router.post('/system/role/edit', function (req, res, next) {
    console.log(req.query)
    res.json({
        "data": DEFAULT_DATA,
        "status": "0"
    });
});

router.post('/system/role/assign', function (req, res, next) {
    console.log(req.body);
    res.json({
        "data": "编辑成功"
    });
});


router.post('/system/role/remove', function (req, res, next) {
    console.log(_.isArray(req.query.id))
    if(_.isArray(req.query.id)){
        _.forEach(req.query.id, function (item) {
            _.remove(role, {id: item*1});
        });
        console.log(role.length);
    }else{
        role.data = role.filter(function (item) {
            return  item.id != req.query.id;
        });
    }
    res.json({
        "data": DEFAULT_DATA,
        "status": "0"
    });
});



































module.exports = router;
