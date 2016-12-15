/**
 * Created by Administrator on 2016/10/17.
 */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 中间件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json());


// 处理跨域问题
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200); //让options请求快速返回
    }
    else {
        next();
    }
});


// 车辆选择通用api
app.use('/shopservice/admin', require('./api/motor'));
// 通用api
app.use('/shopservice/admin', require('./api/category'));



// 店铺管理
app.use('/shopservice/admin', require('./api/store'));

// 商品服务
  //商品管理
app.use('/shopservice/admin', require('./api/goods'));
  //服务管理
app.use('/shopservice/admin', require('./api/server'));

// 订单管理
  //商品订单
app.use('/shopservice/admin', require('./api/porder'));
  //服务订单
app.use('/shopservice/admin', require('./api/sorder'));

// 店员管理
app.use('/shopservice/admin', require('./api/member'));

// 系统管理
app.use('/shopservice/admin', require('./api/system'));



const server = app.listen(9090, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://localhost/', host, port);
});
