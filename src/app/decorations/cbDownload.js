/**
 * Created by Administrator on 2016/12/6.
 */
/**
 * 下载api
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('downloadService', downloadService)
    .directive('cbDownload', cbDownload);

  /** @ngInject */
  function downloadService(requestService) {
    return requestService.request('category', 'download')
  }

  /** @ngInject */
  function cbDownload(downloadService, cbAlert) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, iElement, iAttrs) {
        var download = scope.$eval(iAttrs.cbDownload);
        var filename = download.split("/")[download.split("/").length-1];
        iElement.on('click', function(){
          downloadService.download({
            urlString: encodeURI(download),
            filename: encodeURI(filename)
          }).then(function(data){
            if(data.data.status != "0"){
              cbAlert.error(data.data.rtnInfo);
            }
          });
        });
      }
    }
  }
})();
