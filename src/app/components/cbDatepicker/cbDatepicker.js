/**
 * Created by Administrator on 2016/12/19.
 */
(function () {
  'use strict';
  /**
   * 时间选择组件
   * 需求：
   *    1，可以选择年
   *    2，可以选择月
   *    3，可以选择日
   *    4，可以选择时
   *    5，可以选择分
   *    6，带农历
   *    7，带节假日
   *    8，返回格式时间戳或者当前时间
   *    9，是否可以输入弹出选择框
   *    10，支持文字部分自定义
   */
  angular
    .module('shopApp')
    .provider("cbDatepickerConfig", cbDatepickerConfig)
    .constant('cbDatepickerDefault', {
      formatDay: 'dd',
      format: 'yyyy-MM-dd',
      formatMonth: 'MM',
      formatYear: 'yyyy',
      formatDayHeader: 'EEE',
      formatDayTitle: 'yyyy-MM',
      formatMonthTitle: 'yyyy',
      datepickerMode: 'day',
      minMode: 'day',
      maxMode: 'year',
      showWeeks: true,
      placeholder: "请点击选择时间",
      startingDay: 0,
      yearRange: 20,
      minDate: null,
      maxDate: null,
      showLunar: false,
      showHour: false,
      shwoMinute: false
    })
    .directive('cbDatepicker', cbDatepicker)
    .directive('cbDatepickerYear', cbDatepickerYear)
    .directive('cbDatepickerMonth', cbDatepickerMonth)
    .directive('cbDatepickerDay', cbDatepickerDay)
    .directive('cbDatepickerPopup', cbDatepickerPopup);
  function zeroFill(num) {
    return num < 10 ? '0' + num : '' + num;
  }

  var PatternsDict = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;


  /** @ngInject */
  function cbDatepickerConfig() {
    var options = {
      closeText: "关闭",
      currentText: "今天",
      clearText: "清除",
      focusOpen: false,     // 获取焦点开启选择框
      isLunar: false,       // 显示农历
      openButton: true,     // 显示按钮今天，关闭，清除按钮
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      monthList: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份']
    };
    return {
      config: function (param) {
        angular.isObject(param) && angular.extend(options, param);
      },
      $get: function () {
        return options;
      }
    }
  }

  /** @ngInject */
  function cbDatepicker($document, dateFilter, cbDatepickerConfig, cbDatepickerDefault) {
    return {
      restrict: "A",
      replace: true,
      scope: {
        isOpen: "=",              // 是否打开
        datepickerOptions: "=",   // 配置文件
        datepickerModel: "=",     // 绑定数据
        datepickerOpen: "&",      // 弹窗打开
        datepickerHandler: "&"    // 回调函数
      },
      templateUrl: "app/components/cbDatepicker/cbDatepicker.html",
      controller: ["$scope", "$attrs", function ($scope, $attrs) {
        var _this = this;
        var modes = ['day', 'month', 'year'];
        var configAttr = angular.extend(angular.copy(cbDatepickerDefault), ($scope.datepickerOptions || {}));
        $scope.placeholder = configAttr.placeholder;
        angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
          'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange', 'format', 'showLunar', 'showHour', 'shwoMinute', 'minDate', 'maxDate'], function (key) {
          _this[key] = configAttr[key];
        });

        $scope.datepicker = {};
        var datepickerModel = $scope.datepickerModel;

        if ( $scope.datepickerModel ) {
          var datepicker = $scope.datepickerModel;
          if(!/(\d{4}-\d{2}-\d{2})|(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2})/.test(datepicker)){
            $scope.datepicker.model = "";
          }else{
            var date = new Date( datepicker.replace(/\-/, '/') );
            var isValid = !isNaN(date);
            if ( isValid ) {
              $scope.datepicker.model = dateFilter(date, _this.format);
            } else {
              $scope.datepicker.model = "";
            }
          }
        }


        $scope.setOpen = function(){
          if(!$scope.isOpen){
            datepickerModel = $scope.datepicker.model;
            $scope.datepickerOpen();
          }else{
            $scope.datepickerModel = $scope.datepicker.model;
          }
          $scope.isOpen = !$scope.isOpen;
        };


        $scope.datepickerMode = 'day';
        this.activeDate = new Date();
        this.createDateObject = function (date, format) {
          var model = datepickerModel ? new Date(datepickerModel) : null;
          return {
            date: date,
            label: dateFilter(date, format),
            selected: model && this.compare(date, model) === 0,
            disabled: this.isDisabled(date),
            current: this.compare(date, new Date()) === 0
          };
        };
        this.isDisabled = function (date) {
          return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({
            date: date,
            mode: $scope.datepicker.model
          })));
        };

        this.init = function() {
          _this.render();
        };

        this.render = function() {
          if ( $scope.datepicker.model ) {
            var datepicker = $scope.datepicker.model;
            if(!PatternsDict.test(datepicker)){
              this.activeDate = new Date();
            }else{
              var date = new Date( datepicker.replace(/\-/, '/') );
              var isValid = !isNaN(date);

              if ( isValid ) {
                this.activeDate = date;
              } else {
                this.activeDate = new Date();
              }
            }
          }
          this.refreshView();
        };
        this.refreshView = function() {
          this._refreshView && this._refreshView();
        };

        $scope.move = function (dir, event) {
          event.stopPropagation();
          var year = _this.activeDate.getFullYear() + dir * (_this.step.years || 0),
            month = _this.activeDate.getMonth() + dir * (_this.step.months || 0);
          _this.activeDate.setFullYear(year, month, 1);
          _this.refreshView();
        };
        $scope.toggleMode = function (direction, event) {
          event.stopPropagation();
          $scope.datepickerMode = modes[direction];
        };
        $scope.isOpen = false;
        $scope.currentText = angular.extend({}, cbDatepickerConfig).currentText;
        $scope.clearText = angular.extend({}, cbDatepickerConfig).clearText;
        $scope.closeText = angular.extend({}, cbDatepickerConfig).closeText;
        $scope.close = function (event) {
          $scope.isOpen = false;
          $scope.datepickerModel = $scope.datepicker.model;
          $scope.datepickerHandler({data:$scope.datepickerModel});
        };
        $scope.select = function (day, event) {
          event.stopPropagation();
          if (day == null) {
            $scope.datepicker.model = "";
          } else if (day == 'today') {
            $scope.datepicker.model = dateFilter(new Date(), _this.format);
            event && $scope.close(event);
          } else {
            if (day.next === -1) {
              $scope.datepicker.model = dateFilter(day.date, _this.format);
              $scope.datepickerMode = 'day';
              event && $scope.close(event);
            } else {
              _this.activeDate = day.date;
              $scope.datepickerMode = modes[day.next];
            }
          }
        };
      }],
      link: function (scope, iElement, iAttrs) {
        $document.on('click', function(event){
          if(!iElement.find(event.target).length){
            scope.$apply(function(){
              scope.close();
            });
          }
        });

        iElement.find('.datepicker-model').on('focus', function() {
          scope.$apply(function(){
            !scope.isOpen && scope.setOpen();
          });
        });
      }
    }
  }

  /** @ngInject */
  function cbDatepickerPopup() {
    return {
      restrict: "A",
      replace: true,
      require: '^cbDatepicker',
      templateUrl: "app/components/cbDatepicker/cbDatepickerPopup.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        var isOpen = scope.$watch('isOpen', function(value){
          value && iCtrl.init();
        });
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function () {
          isOpen();
        });
      }
    }
  }

  /** @ngInject */
  function cbDatepickerYear() {
    return {
      restrict: "A",
      replace: true,
      require: '^cbDatepicker',
      templateUrl: "app/components/cbDatepicker/cbDatepickerYear.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        var range = iCtrl.yearRange;
        iCtrl.step = {years: range};
        /**
         * 获取年的区间开始年份
         * @param year
         * @returns {number}
         */
        function getStartingYear(year) {
          return parseInt((year - 1) / range, 10) * range + 1;
        }

        iCtrl._refreshView = function () {
          var yearList = [];
          var start = getStartingYear(iCtrl.activeDate.getFullYear());
          for (var i = 0; i < range; i++) {
            yearList[i] = angular.extend((iCtrl.createDateObject(new Date(start + i, 0, 1), iCtrl.formatYear)), {
              next: 1
            });
          }
          console.log(yearList);

          scope.title = [yearList[0].label, yearList[range - 1].label].join(' - ');
          scope.rows = _.chunk(yearList, 5);
        };
        iCtrl.compare = function (date1, date2) {
          return date1.getFullYear() - date2.getFullYear();
        };
        iCtrl.refreshView();
      }
    }
  }

  /** @ngInject */
  function cbDatepickerMonth(dateFilter, cbDatepickerConfig) {
    return {
      restrict: "A",
      replace: true,
      require: '^cbDatepicker',
      templateUrl: "app/components/cbDatepicker/cbDatepickerMonth.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        iCtrl.step = {years: 1};
        iCtrl._refreshView = function () {
          var monthList = [];
          var year = iCtrl.activeDate.getFullYear();
          for (var i = 0; i < 12; i++) {
            monthList[i] = angular.extend((iCtrl.createDateObject(new Date(year, i, 1), iCtrl.formatMonth)), {
              label: cbDatepickerConfig.monthList[i],
              next: 0
            });
          }
          console.log(monthList);

          scope.title = dateFilter(iCtrl.activeDate, iCtrl.formatMonthTitle);
          scope.rows = _.chunk(monthList, 3);
        };
        iCtrl.compare = function (date1, date2) {
          return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
        };
        iCtrl.refreshView();
      }
    }
  }

  /** @ngInject */
  function cbDatepickerDay(dateFilter, cbDatepickerConfig) {
    return {
      restrict: "A",
      replace: true,
      require: '^cbDatepicker',
      templateUrl: "app/components/cbDatepicker/cbDatepickerDay.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        scope.showWeeks = iCtrl.showWeeks;
        scope.weekList = angular.copy(cbDatepickerConfig.weekList);
        iCtrl.step = {months: 1};
        /**
         * 默认数据
         * 每月的天数
         * DAYS_IN_MONTH
         * 12生肖
         * ANIMALS
         * 24节气
         * SOLAR_TERM
         */
        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        var SOLAR_TERM = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
        var SOLAR_TERM_INFO = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
        var LUNAR_BIT = ['日','一','二','三','四','五','六','七','八','九','十'];
        var LUNAR_TEN = ['初','十','廿','卅'];
        var LUNAR_MONTH = ['正月','二月','三月','四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
        var LUNAR_FESTIVAL = [
          "0101 春节",
          "0115 元宵节",
          "0505 端午节",
          "0707 七夕情人节",
          "0715 中元节",
          "0815 中秋节",
          "0909 重阳节",
          "1208 腊八节",
          "1224 小年"];
        var lunarInfo = [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
          0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
          0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
          0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
          0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
          0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
          0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
          0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
          0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
          0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
          0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
          0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
          0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
          0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
          0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0];

        //返回农历y年的总天数
        function lYearDays(y) {
          var i, sum = 348;
          for(i=0x8000; i>0x8; i>>=1)sum+=(lunarInfo[y-1900]&i)?1:0;
          return(sum+leapDays(y));
        }
        //返回农历y年闰月的天数
        function leapDays(y) {
          return leapMonth(y) ? ((lunarInfo[y-1900] & 0x10000)? 30: 29) : 0
        }

        //判断y年的农历中那个月是闰月,不是闰月返回0
        function leapMonth(y){
          return(lunarInfo[y-1900]&0xf);
        }

        //返回农历y年m月的总天数
        function monthDays(y,m){
          return((lunarInfo[y-1900]&(0x10000>>m))?30:29);
        }


        //返回公历y年m+1月的天数
        function getDaysInMonth(year, month) {
          return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
        }
        /**
         *
         * @param y
         * @param n
         * @returns {number}
         */
        function getTerm(y,n) {
          var offDate = new Date((31556925974.7*(y-1900)+SOLAR_TERM_INFO[n]*60000)+Date.UTC(1900,0,6,2,5));
          return(offDate.getUTCDate())
        }
        function getDates(startDate, n) {
          var dates = new Array(n), current = new Date(startDate), i = 0;
          current.setHours(12); // Prevent repeated dates because of timezone bug
          while (i < n) {
            dates[i++] = new Date(current);
            current.setDate(current.getDate() + 1);
          }
          return dates;
        }


        //算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
        function Dianaday(objDate) {
          var i, leap=0, temp=0;
          var baseDate = new Date(1900,0,31);
          var offset   = (objDate - baseDate)/86400000;
          this.dayCyl = offset+40;
          this.monCyl = 14;
          for(i=1900; i<2050 && offset>0; i++) {
            temp = lYearDays(i);
            offset -= temp;
            this.monCyl += 12;
          }
          if(offset<0) {
            offset += temp;
            i--;
            this.monCyl -= 12;
          }
          this.year = i;
          this.yearCyl=i-1864;
          leap = leapMonth(i); //闰哪个月
          this.isLeap = false;
          for(i=1; i<13 && offset>0; i++) {
            if(leap>0 && i==(leap+1) && this.isLeap==false){	//闰月
              --i; this.isLeap = true; temp = leapDays(this.year);}
            else{
              temp = monthDays(this.year, i);}
            if(this.isLeap==true && i==(leap+1)) this.isLeap = false;	//解除闰月
            offset -= temp;
            if(this.isLeap == false) this.monCyl++;
          }
          if(offset==0 && leap>0 && i==leap+1)
            if(this.isLeap){ this.isLeap = false;}
            else{this.isLeap=true;--i;--this.monCyl;}
          if(offset<0){offset+=temp;--i;--this.monCyl;}
          this.month=i;
          this.day=offset+1;
        }

        function getLunar(date){
          return getCday(new Dianaday(date));
        }

        //用中文显示农历的日期
        function getCday(dianaday){
          var name;
          var day = parseInt(dianaday.day, 10);
          switch (day) {
            case 1:
              if(dianaday.isLeap){
                name = '闰'+LUNAR_MONTH[dianaday.month-1];
              }else{
                name = LUNAR_MONTH[dianaday.month-1];
              }
              break;
            case 10:
              name = '初十';
              break;
            case 20:
              name = '二十';
              break;
            case 30:
              name = '三十';
              break;
            default:
              name = LUNAR_TEN[Math.floor(day/10)];
              name += LUNAR_BIT[day%10];
          }
          return name;
        }

        iCtrl._refreshView = function () {
          var year = iCtrl.activeDate.getFullYear(),
            month = iCtrl.activeDate.getMonth(),
            firstDayOfMonth = new Date(year, month, 1),
            difference = iCtrl.startingDay - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
            firstDate = new Date(firstDayOfMonth);
          if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
          }
          // 42 is the number of days on a six-month calendar
          var dayLsit = getDates(firstDate, 42);
          for (var i = 0; i < 42; i++) {
            dayLsit[i] = angular.extend(iCtrl.createDateObject(dayLsit[i], iCtrl.formatDay), {
              secondary: dayLsit[i].getMonth() !== month,
              lunar: iCtrl.showLunar ? getLunar(dayLsit[i]) : '',
              next: -1
            });
          }
          if(iCtrl.showLunar){
            scope.title = dateFilter(iCtrl.activeDate, iCtrl.formatDayTitle) + ' 【' + ANIMALS[(year-4)%12] + '】';
          }else{
            scope.title = dateFilter(iCtrl.activeDate, iCtrl.formatDayTitle);
          }
          scope.rows = _.chunk(dayLsit, 7);
        };
        iCtrl.compare = function (date1, date2) {
          return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
        };
        iCtrl.refreshView();
      }
    }
  }

})();
