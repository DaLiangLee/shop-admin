/**
 * Created by Administrator on 2016/10/15.
 */


(function(){
  'use strict';
  angular
    .module('shopApp')
    .constant("insuranceData",insuranceData())
    .filter("insuranceFilter",insuranceFilter);

  function insuranceData(){
    return [ {
      id : "1",
      companyname : "平安保险"
    }, {
      id : "2",
      companyname : "中国人保保险"
    }, {
      id : "3",
      companyname : "太平洋保险"
    }, {
      id : "4",
      companyname : "中华联合保险"
    }, {
      id : "5",
      companyname : "大地保险"
    }, {
      id : "6",
      companyname : "天安保险"
    }, {
      id : "7",
      companyname : "永安保险"
    }, {
      id : "8",
      companyname : "阳光保险"
    }, {
      id : "9",
      companyname : "安邦保险"
    }, {
      id : "10",
      companyname : "太平保险"
    } ];
  }

  function insuranceFilter(insuranceData){
    return function (id){
      if(id !== "0") {
        return insuranceData[id-1].companyname;
        // console.log(insuranceData[id].companyname);
      }
    }
  }
})();




