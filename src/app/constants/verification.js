/**
 * Created by Administrator on 2016/11/3.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .constant('webSiteVerification', {
      REGULAR: {
        "tel400": /^400[0-9]{7}$/,
        "tel800": /^800[0-9]{7}$/,
        "fixedTel": /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
        "phone": /^(1[3|5|7|8][0-9]{9}|14[5|7|9][0-9]{8})$/,
        'bank': /(^\d{16}$)|(^\d{19}$)/,
        'money': /(^[1-9]([0-9]){0,7}?(\.[0-9]{1,2})?$)|(^0$)|(^[0-9]\.[0-9]([0-9])?$)/
      },
      FORMAT: {
        'tel': /(^01[\d]{1}|^02[\d]{1}|^0[\d]{3}|^1[\d]{2}|^400|800)([\d]{4})([\d]{3,4})/,
        'bank': /([\d]{4})([\d]{4})([\d]{4})([\d]{4})([\d]{0,})?/
      },
      UPLOAD: {
        'images': {
          'title': 'Image files',
          'extensions': 'jpg,gif,png'
        },
        'excel': {
            'title': 'Excel files',
            'extensions': 'xlsx,xls'
        }
      }
    });
})();

