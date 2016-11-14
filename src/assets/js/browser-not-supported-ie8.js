/**
 * Created by Administrator on 2016/11/9.
 */
if(window.attachEvent){
  window.attachEvent('onload', function(){
    var el = document.createElement('div'),
      elStyle = el.style,
      docBody = document.getElementsByTagName('body')[0],
      linkStyle = 'color:#06F;text-decoration: underline;';
    el.innerHTML =	'<div>尊敬的用户,阿里云管理控制台计划于2016年6月1日开始不再保障IE8浏览器下的可用性,<a href="https://help.aliyun.com/noticelist/articleid/13107836.html" target="_blank">查看详情</a>。建议您尽快<a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie"target="_blank">升级浏览器</a>，或者使用<a href="http://www.google.com/intl/zh-CN/chrome/" target="_blank">Chrome</a>、<a href="http://www.firefox.com.cn/download/" target="_blank">Firefox</a>。</div>';
    // elStyle.width = '100%';
    elStyle.width = '100%';
    elStyle.color = '#090';
    elStyle.fontSize = '12px';
    //elStyle.lineHeight = '180%';
    //elStyle.margin = '60px auto';
    elStyle.backgroundColor = '#F2FFEA';
    //elStyle.border = '1px solid #CCC';
    elStyle.padding = '12px 11px';
    // elStyle.background = '#F00 url(styles/images/not-support-ie67.png) 48px 48px no-repeat';
    // elStyle.padding = '40px 40px 48px 160px';
    //docBody.innerHTML = '';
    //docBody.appendChild(el);
    docBody.insertBefore(el,docBody.firstChild);
  });
}
