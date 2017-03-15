<%@ page contentType="text/html;charset=UTF-8" %><%@ include file="/WEB-INF/views/include/_taglib.jsp" %><!doctype html>
<!--[if IE 8 ]>    <html class="ie8" lang="zh-cn"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9" lang="zh-cn"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="zh-cn"> <!--<![endif]-->
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
  <meta name="renderer" content="webkit">
  <title>商家后台管理-${fns:getConfig('title')}</title>
  <meta name="description" content="这是描述">
  <meta name="keywords" content="这是关键词">
  <%@ include file="/WEB-INF/views/include/_header.jsp" %>

    <link rel="stylesheet" href="${ctxStatic}/shops/styles/vendor-496a7fbb71.css">

    <link rel="stylesheet" href="${ctxStatic}/shops/styles/app-6f8d00b273.css">
   <!-- <script src="${ctxStatic}/shops/js/browser-not-supported.js"></script>-->
  <!--[if lt IE 9]>
    <script src="${ctxStatic}/shops/js/shim/ie8.js" type="text/javascript"></script>
    <link href="${ctxStatic}/shops/respond/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />
    <link href="${ctxStatic}/shops/respond/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />
    <script src="${ctxStatic}/shops/respond/respond.proxy.js" type="text/javascript"></script>
  <![endif]-->
  <script>var userPermissionList = ${member};</script>
  </head>
  <body>
    <div view-framework class="view-framework" ng-class="{'viewFramework-sidebar-mini':(!view.config.disableNavigation && !view.config.hideSidebar) && view.config.sidebar == 'mini', 'viewFramework-sidebar-full': (!view.config.disableNavigation && !view.config.hideSidebar) && view.config.sidebar == 'full','viewFramework-topbar-hide': view.config.disableNavigation || view.config.hideTopbar}"></div>
    <div view-framework-preloader></div>
    <script src="${ctxStatic}/shops/scripts/vendor-a638d92246.js"></script>

    <script src="${ctxStatic}/shops/scripts/app-5f3ed83b0f.js"></script>

  </body>
</html>
