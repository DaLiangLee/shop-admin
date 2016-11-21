/**
 * Created by Administrator on 2016/11/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('vehicleSelection', vehicleSelection)
    .directive('cbVehicleSelection', cbVehicleSelection);

  /** @ngInject */
  function vehicleSelection() {
    /**
     * 通过本地存储来保存文件
     * sessionStorage   在关闭页面后即被清空
     * localStorage     一直保存
     * 设置数据    setItem(key,value)
     * 全部数据    valueOf()
     * 获取数据    getItem(key)
     * 删除数据    removeItem(key)
     * 清空数据    clear()
     * 存储熟练    length
     * 事件监听    storage[ie有兼容性问题]
     */
      /**
       * 汽车名字
       * @type {{}}
       */
      var vehicleNames = {};
      /**
       * 汽车品牌
       * @type {{}}
       */
       var vehicleBrands = {};
       /**
       * 汽车品牌分类
       */
       var vehicleBrandsClasses = {};
  }
  var data = [{"brand":"AC Schnitzer","firstletter":"A","id":1,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png"},{"brand":"阿尔法罗密欧","firstletter":"A","id":4,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AErFaLuoMiOu.png"},{"brand":"阿斯顿·马丁","firstletter":"A","id":5,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_ASiDunMaDing.png"},{"brand":"安凯客车","firstletter":"A","id":6,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png"},{"brand":"奥迪","firstletter":"A","id":7,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AoDi.png"},{"brand":"巴博斯","firstletter":"B","id":8,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png"},{"brand":"宝骏","firstletter":"B","id":9,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoJun.png"},{"brand":"宝马","firstletter":"B","id":11,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoMa.png"},{"brand":"保时捷","firstletter":"B","id":13,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoShiJie.png"},{"brand":"北京汽车","firstletter":"B","id":14,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiJingQiChe.png"},{"brand":"北汽幻速","firstletter":"B","id":15,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiQiHuanSu.png"},{"brand":"北汽绅宝","firstletter":"B","id":16,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiJingQiChe.png"},{"brand":"北汽威旺","firstletter":"B","id":17,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiQiWeiWang.png"},{"brand":"北汽新能源","firstletter":"B","id":18,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiJingQiChe.png"},{"brand":"北汽制造","firstletter":"B","id":19,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiQiZhiZao.png"},{"brand":"奔驰","firstletter":"B","id":20,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BenChi.png"},{"brand":"奔腾","firstletter":"B","id":21,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BenTeng.png"},{"brand":"本田","firstletter":"B","id":22,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BenTian.png"},{"brand":"比亚迪","firstletter":"B","id":23,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BiYaDi.png"},{"brand":"标致","firstletter":"B","id":24,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BiaoZhi.png"},{"brand":"别克","firstletter":"B","id":25,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BieKe.png"},{"brand":"宾利","firstletter":"B","id":26,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BingLi.png"},{"brand":"布加迪","firstletter":"B","id":27,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BuJiaDi.png"},{"brand":"昌河","firstletter":"C","id":28,"logo":"http://localhost:9090/shopservice/public/logo/motor/C_ChangHe.png"},{"brand":"长安","firstletter":"C","id":29,"logo":"http://localhost:9090/shopservice/public/logo/motor/C_ChangAnJiaoChe.png"},{"brand":"长安商用","firstletter":"C","id":30,"logo":"http://localhost:9090/shopservice/public/logo/motor/C_ChangAnShangYong.png"},{"brand":"长城","firstletter":"C","id":31,"logo":"http://localhost:9090/shopservice/public/logo/motor/C_ChangCheng.png"},{"brand":"成功汽车","firstletter":"C","id":32,"logo":"http://localhost:9090/shopservice/public/logo/motor/C_ChengGong.png"},{"brand":"DS","firstletter":"D","id":35,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DS.png"},{"brand":"大发","firstletter":"D","id":36,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DaFa.png"},{"brand":"大众","firstletter":"D","id":37,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DaZhong.png"},{"brand":"道奇","firstletter":"D","id":38,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DaoQi.png"},{"brand":"东风","firstletter":"D","id":39,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongFeng.png"},{"brand":"东风风度","firstletter":"D","id":40,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongFeng.png"},{"brand":"东风风神","firstletter":"D","id":41,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongFeng.png"},{"brand":"东风风行","firstletter":"D","id":42,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongFeng.png"},{"brand":"东风小康","firstletter":"D","id":43,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongFeng.png"},{"brand":"东南","firstletter":"D","id":44,"logo":"http://localhost:9090/shopservice/public/logo/motor/D_DongNan.png"},{"brand":"法拉利","firstletter":"F","id":48,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FaLaLi.png"},{"brand":"菲亚特","firstletter":"F","id":50,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FeiYaTe.png"},{"brand":"丰田","firstletter":"F","id":51,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FengTian.png"},{"brand":"福迪","firstletter":"F","id":52,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FuDi.png"},{"brand":"福汽启腾","firstletter":"F","id":53,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FuQiQiTeng.png"},{"brand":"福特","firstletter":"F","id":54,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FuTe.png"},{"brand":"福田","firstletter":"F","id":55,"logo":"http://localhost:9090/shopservice/public/logo/motor/F_FuTian.png"},{"brand":"GMC","firstletter":"G","id":56,"logo":"http://localhost:9090/shopservice/public/logo/motor/G_GMC.png"},{"brand":"观致","firstletter":"G","id":58,"logo":"http://localhost:9090/shopservice/public/logo/motor/G_GuanZhi.png"},{"brand":"光冈","firstletter":"G","id":59,"logo":"http://localhost:9090/shopservice/public/logo/motor/G_GuangGang.png"},{"brand":"广汽传祺","firstletter":"G","id":60,"logo":"http://localhost:9090/shopservice/public/logo/motor/G_GuangQi.png"},{"brand":"广汽吉奥","firstletter":"G","id":61,"logo":"http://localhost:9090/shopservice/public/logo/motor/G_GuangQiJiAo.png"},{"brand":"哈飞","firstletter":"H","id":64,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HaFei.png"},{"brand":"哈弗","firstletter":"H","id":65,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HaFu.png"},{"brand":"海格","firstletter":"H","id":66,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HaiGe.png"},{"brand":"海马","firstletter":"H","id":67,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HaiMa.png"},{"brand":"悍马","firstletter":"H","id":69,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HanMa.png"},{"brand":"恒天","firstletter":"H","id":70,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HengTianQiChe.png"},{"brand":"红旗","firstletter":"H","id":71,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HongQi.png"},{"brand":"华利","firstletter":"H","id":72,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HuaLi.png"},{"brand":"华普","firstletter":"H","id":73,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HuaPu.png"},{"brand":"华颂","firstletter":"H","id":75,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HuaSong.png"},{"brand":"华泰","firstletter":"H","id":76,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HuaTai.png"},{"brand":"黄海","firstletter":"H","id":77,"logo":"http://localhost:9090/shopservice/public/logo/motor/H_HuangHai.png"},{"brand":"Jeep","firstletter":"J","id":79,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JEEP.png"},{"brand":"吉利汽车","firstletter":"J","id":80,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JiLi.png"},{"brand":"江淮","firstletter":"J","id":81,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JiangHuai.png"},{"brand":"江铃","firstletter":"J","id":82,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JiangLing.png"},{"brand":"江铃集团轻汽","firstletter":"J","id":83,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JiangLinQingQi.png"},{"brand":"捷豹","firstletter":"J","id":85,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JieBao.png"},{"brand":"金杯","firstletter":"J","id":86,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JingBei.png"},{"brand":"金龙","firstletter":"J","id":87,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JinLong.png"},{"brand":"金旅","firstletter":"J","id":88,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JinLvKeChe.png"},{"brand":"九龙","firstletter":"J","id":89,"logo":"http://localhost:9090/shopservice/public/logo/motor/J_JiuLong.png"},{"brand":"KTM","firstletter":"K","id":90,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KTM.png"},{"brand":"卡尔森","firstletter":"K","id":91,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KaErSen.png"},{"brand":"卡威","firstletter":"K","id":92,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KaWei.png"},{"brand":"开瑞","firstletter":"K","id":93,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KaiRui.png"},{"brand":"凯迪拉克","firstletter":"K","id":95,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KaiDiLaKe.png"},{"brand":"凯翼","firstletter":"K","id":96,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KaiYi.png"},{"brand":"科尼赛克","firstletter":"K","id":97,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KeNiSaiKe.png"},{"brand":"克莱斯勒","firstletter":"K","id":98,"logo":"http://localhost:9090/shopservice/public/logo/motor/K_KeLaiSiLe.png"},{"brand":"兰博基尼","firstletter":"L","id":99,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LanBoJiNi.png"},{"brand":"劳斯莱斯","firstletter":"L","id":102,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LaoSiLaiSi.png"},{"brand":"雷克萨斯","firstletter":"L","id":104,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LeiKeSaSi.png"},{"brand":"雷诺","firstletter":"L","id":105,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LeiNuo.png"},{"brand":"理念","firstletter":"L","id":106,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LiNian.png"},{"brand":"力帆","firstletter":"L","id":107,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LiFan.png"},{"brand":"莲花汽车","firstletter":"L","id":108,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LianHua.png"},{"brand":"猎豹汽车","firstletter":"L","id":109,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LieBao.png"},{"brand":"林肯","firstletter":"L","id":110,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LinKen.png"},{"brand":"铃木","firstletter":"L","id":111,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LingMu.png"},{"brand":"陆风","firstletter":"L","id":113,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LuFeng.png"},{"brand":"路虎","firstletter":"L","id":114,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LuHu.png"},{"brand":"路特斯","firstletter":"L","id":115,"logo":"http://localhost:9090/shopservice/public/logo/motor/L_LuTeSi.png"},{"brand":"MG","firstletter":"M","id":116,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MG.png"},{"brand":"MINI","firstletter":"M","id":117,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MiNi.png"},{"brand":"马自达","firstletter":"M","id":118,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MaZiDa.png"},{"brand":"玛莎拉蒂","firstletter":"M","id":119,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MaSaLaDi.png"},{"brand":"迈巴赫","firstletter":"M","id":120,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MaiBaHe.png"},{"brand":"迈凯伦","firstletter":"M","id":121,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MaiKaiLun.png"},{"brand":"摩根","firstletter":"M","id":123,"logo":"http://localhost:9090/shopservice/public/logo/motor/M_MoGen.png"},{"brand":"纳智捷","firstletter":"N","id":126,"logo":"http://localhost:9090/shopservice/public/logo/motor/N_NaZhiJie.png"},{"brand":"南京金龙","firstletter":"N","id":127,"logo":"http://localhost:9090/shopservice/public/logo/motor/N_NanJingJinLong.png"},{"brand":"讴歌","firstletter":"O","id":128,"logo":"http://localhost:9090/shopservice/public/logo/motor/O_OuGe.png"},{"brand":"欧宝","firstletter":"O","id":129,"logo":"http://localhost:9090/shopservice/public/logo/motor/O_OuBao.png"},{"brand":"欧朗","firstletter":"O","id":130,"logo":"http://localhost:9090/shopservice/public/logo/motor/O_OuLang.png"},{"brand":"帕加尼","firstletter":"P","id":131,"logo":"http://localhost:9090/shopservice/public/logo/motor/P_PaJiaNi.png"},{"brand":"奇瑞","firstletter":"Q","id":133,"logo":"http://localhost:9090/shopservice/public/logo/motor/Q_QiRui.png"},{"brand":"启辰","firstletter":"Q","id":134,"logo":"http://localhost:9090/shopservice/public/logo/motor/Q_QiChen.png"},{"brand":"起亚","firstletter":"Q","id":135,"logo":"http://localhost:9090/shopservice/public/logo/motor/Q_QiYa.png"},{"brand":"前途","firstletter":"Q","id":136,"logo":"http://localhost:9090/shopservice/public/logo/motor/Q_QianTu.png"},{"brand":"日产","firstletter":"R","id":141,"logo":"http://localhost:9090/shopservice/public/logo/motor/R_RiChan.png"},{"brand":"荣威","firstletter":"R","id":142,"logo":"http://localhost:9090/shopservice/public/logo/motor/R_RongWei.png"},{"brand":"如虎","firstletter":"R","id":143,"logo":"http://localhost:9090/shopservice/public/logo/motor/R_RuHu.png"},{"brand":"瑞麒","firstletter":"R","id":144,"logo":"http://localhost:9090/shopservice/public/logo/motor/R_RuiQi.png"},{"brand":"smart","firstletter":"S","id":146,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_Smart.png"},{"brand":"萨博","firstletter":"S","id":149,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SaBo.png"},{"brand":"赛麟","firstletter":"S","id":150,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SaiLin.png"},{"brand":"三菱","firstletter":"S","id":151,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SanLing.png"},{"brand":"上汽大通","firstletter":"S","id":153,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_ShangQiDaTong.png"},{"brand":"世爵","firstletter":"S","id":154,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_ShiJue.png"},{"brand":"双环","firstletter":"S","id":155,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_ShuangHuan.png"},{"brand":"双龙","firstletter":"S","id":156,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_ShuangLong.png"},{"brand":"思铭","firstletter":"S","id":157,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SiMing.png"},{"brand":"斯巴鲁","firstletter":"S","id":158,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SiBaLu.png"},{"brand":"斯柯达","firstletter":"S","id":159,"logo":"http://localhost:9090/shopservice/public/logo/motor/S_SiKeDa.png"},{"brand":"特斯拉","firstletter":"T","id":161,"logo":"http://localhost:9090/shopservice/public/logo/motor/T_TeSiLa.png"},{"brand":"腾势","firstletter":"T","id":162,"logo":"http://localhost:9090/shopservice/public/logo/motor/T_TengShi.png"},{"brand":"威麟","firstletter":"W","id":165,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WeiLin.png"},{"brand":"威兹曼","firstletter":"W","id":166,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WeiZiMan.png"},{"brand":"潍柴英致","firstletter":"W","id":164,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WeiCaiYingZhi.png"},{"brand":"沃尔沃","firstletter":"W","id":167,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WoErWo.png"},{"brand":"五菱汽车","firstletter":"W","id":169,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WuLing.png"},{"brand":"五十铃","firstletter":"W","id":170,"logo":"http://localhost:9090/shopservice/public/logo/motor/W_WuShiLing.png"},{"brand":"西雅特","firstletter":"X","id":171,"logo":"http://localhost:9090/shopservice/public/logo/motor/X_XiYaTe.png"},{"brand":"现代","firstletter":"X","id":173,"logo":"http://localhost:9090/shopservice/public/logo/motor/X_XianDai.png"},{"brand":"雪佛兰","firstletter":"X","id":175,"logo":"http://localhost:9090/shopservice/public/logo/motor/X_XueFuLan.png"},{"brand":"雪铁龙","firstletter":"X","id":176,"logo":"http://localhost:9090/shopservice/public/logo/motor/X_XueTieLong.png"},{"brand":"野马汽车","firstletter":"Y","id":178,"logo":"http://localhost:9090/shopservice/public/logo/motor/Y_YeMaQiChe.png"},{"brand":"一汽","firstletter":"Y","id":179,"logo":"http://localhost:9090/shopservice/public/logo/motor/Y_YiQi.png"},{"brand":"依维柯","firstletter":"Y","id":180,"logo":"http://localhost:9090/shopservice/public/logo/motor/Y_YiWeiKe.png"},{"brand":"英菲尼迪","firstletter":"Y","id":181,"logo":"http://localhost:9090/shopservice/public/logo/motor/Y_YingFeiNiDi.png"},{"brand":"永源","firstletter":"Y","id":182,"logo":"http://localhost:9090/shopservice/public/logo/motor/Y_YongYuan.png"},{"brand":"知豆","firstletter":"Z","id":188,"logo":"http://localhost:9090/shopservice/public/logo/motor/Z_ZhiDou.png"},{"brand":"中华","firstletter":"Z","id":189,"logo":"http://localhost:9090/shopservice/public/logo/motor/Z_ZhongHua.png"},{"brand":"中兴","firstletter":"Z","id":192,"logo":"http://localhost:9090/shopservice/public/logo/motor/Z_ZhongXing.png"},{"brand":"众泰","firstletter":"Z","id":193,"logo":"http://localhost:9090/shopservice/public/logo/motor/Z_ZhongTai.png"}];

/**
   * data         获取交互数据
   * config       配置信息
   * selectItem   返回数据
   */

  /** @ngInject */
  function cbVehicleSelection($filter, vehicleSelection) {
    function getGroupList(arr){
      var result = {};
      angular.forEach(arr, function (item) {
          if(!result[item.firstletter]){
            result[item.firstletter] = [];
          }
          result[item.firstletter].push(item);
      });
      return result;
    }
    return {
      restrict: "A",
      scope: {
        data: "=",
        config: "=",
        selectItem: '&'
      },
      templateUrl: "app/components/cbVehicleSelection/cbVehicleSelection.html",
      link: function (scope, iElement, iAttrs) {

        var list = getGroupList(data);

        scope.brandList = getGroupList(data);
        scope.seriesList = [{"id":99,"series":"宝马2系旅行车"},{"id":100,"series":"宝马3系"},{"id":101,"series":"宝马5系"},{"id":102,"series":"宝马X1"},{"id":103,"series":"3.0 CSL Hommage"},{"id":104,"series":"Compact Sedan"},{"id":105,"series":"Gran Lusso"},{"id":106,"series":"Vision Future Luxury"},{"id":107,"series":"Zagato Coupe"},{"id":108,"series":"宝马1系"},{"id":109,"series":"宝马2系"},{"id":110,"series":"宝马2系多功能旅行车"},{"id":111,"series":"宝马2系旅行车(进口)"},{"id":112,"series":"宝马3系(进口)"},{"id":113,"series":"宝马3系GT"},{"id":114,"series":"宝马4系"},{"id":115,"series":"宝马5系(进口)"},{"id":116,"series":"宝马5系GT"},{"id":117,"series":"宝马6系"},{"id":118,"series":"宝马7系"},{"id":119,"series":"宝马i3"},{"id":120,"series":"宝马i8"},{"id":121,"series":"宝马X1(进口)"},{"id":122,"series":"宝马X3"},{"id":123,"series":"宝马X4"},{"id":124,"series":"宝马X5"},{"id":125,"series":"宝马X6"},{"id":126,"series":"宝马Z4"},{"id":127,"series":"Active Tourer"},{"id":128,"series":"ConnectedDrive"},{"id":129,"series":"EfficientDynamics"},{"id":130,"series":"Isetta"},{"id":131,"series":"宝马8系"},{"id":132,"series":"宝马GINA"},{"id":133,"series":"宝马Z8"},{"id":134,"series":"宝马M2"},{"id":135,"series":"宝马M3"},{"id":136,"series":"宝马M4"},{"id":137,"series":"宝马M5"},{"id":138,"series":"宝马M6"},{"id":139,"series":"宝马X5 M"},{"id":140,"series":"宝马X6 M"},{"id":141,"series":"宝马1系M"},{"id":142,"series":"宝马M1"}];
        scope.yearList = [{"id":287,"year":"2015"},{"id":288,"year":"2014"},{"id":289,"year":"2016"},{"id":290,"year":"2013"},{"id":291,"year":"2011"},{"id":292,"year":"2010"},{"id":293,"year":"2009"},{"id":294,"year":"2008"},{"id":295,"year":"2006"},{"id":296,"year":"2004"}]
      scope.outputList = [{"id":25,"output":"2.0T"},{"id":45,"output":"3.0T"}];
      scope.modelList = [{"brandid":11,"gearid":23,"logo":"B_BaoMa.png","model":"宝马X5 2015款 xDrive35i中国限量版","outputid":45,"seriesid":124,"structid":2,"year":"2015"}];


      scope.firsthandle = function (search) {
        if(/^[A-Z]{1}$/.test(search)){
          scope.brandList = getGroupList($filter('filter')(data, {firstletter: search}))
        }else{
          scope.brandList = getGroupList($filter('filter')(data, {brand: search}))
        }
      };
      scope.selecthandle = function(cid, pid){
        // 第一项
        if(angular.isUndefined(pid)){
          clear();
        }else{

        }
      };

      function clear(){
        scope.seriesList = [];
        scope.yearList = [];
        scope.outputList = [];
        scope.modelList = [];
      }
      scope.search = {
          text: "",
          handler: function(){
            if(!this.text){
              return ;
            }
            /*vehicleSelection.query(this.text).then(function () {

            });*/
            console.log(this);
          }
        }
      }
    }
  }
})();
