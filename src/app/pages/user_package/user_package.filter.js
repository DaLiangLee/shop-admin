/**
 * Created by Administrator on 2017/6/14.
 */

(function(){
  'use strict';
  angular
    .module('shopApp')
    .filter("timeState",timeState);

  function timeState(){
    return function(input,flag){
      if(flag === "date"){
        if(!input){
          return "永久有效";
        }else {
          return input;
        }
      }else if (flag === "time"){
        if(!input){
          return "永久有效";
        }else {
          if(input < 0){
            return '0 天';
          }
          return input + ' 天';
        }
      }
    }
  }
})();
