'use strict';
var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'shopApp',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.replace(/(console.log\(\S+?\);)/ig, ''))
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.replace(/\$\.post\("http:\/\/localhost:3000\/shopservice\/login",{storecode:"\w*",username:"\w*",password:"\w*"}\),/, ''))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
/*    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))*/
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.build, '/')))
    .pipe($.size({ title: path.join(conf.paths.build, '/'), showFiles: true }));
  });

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.build, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss,md}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.build, '/')));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.build, '/'), path.join(conf.paths.tmp, '/'), path.join(conf.paths.dist, '/'), path.join(conf.paths.release, '/')]);
});

gulp.task('htmlToJSP', ['html', 'fonts', 'other'], function () {
  return gulp.src([
      path.join(conf.paths.build, '/index.html')
    ])
    .pipe($.rename({
      basename: "index",
      extname: ".jsp"      // 修改一个jsp后缀html文件
    }))
    .pipe($.replace('<!doctype html>', '<%@ page contentType="text/html;charset=UTF-8" %><%@ include file="/WEB-INF/views/include/_taglib.jsp" %><!doctype html>'))
    .pipe($.replace('<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />', '<%@ include file="/WEB-INF/views/include/_header.jsp" %>'))
    .pipe($.replace(/<\s*script[^>]* id="BUILD_FLAG">(.|[\r\n])*?<\s*\/script[^>]*>/gi, '<script>var userPermissionList = ${member};</script>'))
    .pipe($.replace('"styles/', '"${ctxStatic}/shops/styles/'))
    .pipe($.replace('"assets/', '"${ctxStatic}/shops/'))
    .pipe($.replace('"scripts/', '"${ctxStatic}/shops/scripts/'))
    .pipe(gulp.dest(conf.paths.release));
});

gulp.task('zip', ['htmlToJSP'], function () {
  return gulp.src([
    path.join(conf.paths.build, '/**/*'),
    path.join('!' + conf.paths.build, '/index.html')
  ])
    .pipe($.zip('release.zip'))
    .pipe(gulp.dest(conf.paths.release))
});

/*gulp.task('build', ['clean', 'html', 'fonts', 'other'], function () {
  console.log(1)
});*/



gulp.task('build', ['clean', 'zip'], function () {
  // gulp.start('clean');
});
