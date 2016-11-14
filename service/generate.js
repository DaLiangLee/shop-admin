/**
 * Created by Administrator on 2016/10/17.
 */
const Mock = require('mockjs');

module.exports = function (template, length) {
    var template = template || {},
        length = length || 10;
    const data = {
        data: generateData(template, length)
    }
    function generateData(template, length){
        var results = [],
            template = template || {},
            length = length || 1;
        for (var i = 0; i < length; i++) {
            results.push(template)
        }
        return Mock.mock(results);
    }
    return data;
};