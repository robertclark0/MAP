// Include gulp
var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require('gulp-order');


// Javascript Libraries
gulp.task('libraries.js', function () {
    return gulp.src([
        'libraries/jquery/jquery-1.12.3.min.js',
        'libraries/angular/angular.min.js',
        'libraries/angular/angular-material.min.js',
        'libraries/angular/angular-loading-bar.min.js',
        'libraries/angular/angular-sanitize.min.js',
        'libraries/angular/angular-animate.min.js',
        'libraries/angular/angular-aria.min.js',
        'libraries/angular/angular-resource.min.js',
        'libraries/angular/angular-ui-router.min.js',
        'libraries/angular/angular-css.min.js',
        'libraries/angular/angular-gridster.min.js',
        'libraries/highcharts/highcharts.min.js',
        'libraries/ngStorage/ngStorage.min.js',
        'libraries/ocLazyLoad/ocLazyLoad.min.js',
        'libraries/jsoneditor/jsoneditor-minimalist.min.js'
    ])
      .pipe(concat('dist.libraries.min.js'))
      .pipe(gulp.dest('assets/js'));
});


//  Main 
//  MAP Application & App Manager
gulp.task('mapApp.module.js', function () {
    return gulp.src([
        'assets/js/app.module.js',
        'assets/js/app.config.js',
        'core-components/application-manager/**/*.js',
        'shared-components/**/*.js'
    ])
      .pipe(order([
          'app.module.js',
          '**/module.js'
      ]))
      .pipe(concat('dist.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('mapApp.module.css', function () {
    return gulp.src([
        'assets/css/roboto.css',
        'libraries/bootstrap/bootstrap.min.css',
        'libraries/angular/angular-material.min.css',
        'libraries/angular/angular-loading-bar.min.css',
        'libraries/angular/angular-gridster.min.css',
        'libraries/jsoneditor.min.css',
        'assets/css/style.css',       
        'shared-components/**/*.css'
    ])
      .pipe(concat('dist.css'))
      .pipe(gulp.dest('assets/css'));
});


//  Module
//  Platform Home
gulp.task('platformHome.module.js', function () {
    return gulp.src([
        'core-components/platform-home/**/*.js',
    ])
      .pipe(order([
          '**/module.js'
      ]))
      .pipe(concat('dist.platformHome.module.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('platformHome.module.css', function () {
    return gulp.src([
        'core-components/platform-home/**/*.css',
    ])
      .pipe(concat('dist.platformHome.css'))
      .pipe(gulp.dest('assets/css'));
});


//  Module
//  Analysis
gulp.task('analysis.module.js', function () {
    return gulp.src([
        'core-components/analysis/**/*.js',
    ])
      .pipe(order([
          '**/module.js'
      ]))
      .pipe(concat('dist.analysis.module.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('analysis.module.css', function () {
    return gulp.src([
        'core-components/analysis/**/*.css',
    ])
      .pipe(concat('dist.analysis.css'))
      .pipe(gulp.dest('assets/css'));
});


//  Module
//  Reporting
gulp.task('reporting.module.js', function () {
    return gulp.src([
        'core-components/reporting/**/*.js',
    ])
      .pipe(order([
          '**/module.js'
      ]))
      .pipe(concat('dist.reporting.module.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('reporting.module.css', function () {
    return gulp.src([
        'core-components/reporting/**/*.css',
    ])
      .pipe(concat('dist.reporting.css'))
      .pipe(gulp.dest('assets/css'));
});


// Execute Default Tasks
gulp.task('default', [
    'libraries.js',
    'mapApp.module.js',
    'mapApp.module.css',
    'platformHome.module.js',
    'platformHome.module.css',
    'analysis.module.js',
    'analysis.module.css',
    'reporting.module.js',
    'reporting.module.css',
    ]);