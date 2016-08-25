﻿// Include gulp
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
        'libraries/highcharts/highcharts.js',
        'libraries/ngStorage/ngStorage.min.js',
        'libraries/ocLazyLoad/ocLazyLoad.min.js'
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
//  Metric Dashboard
gulp.task('metricDashboard.module.js', function () {
    return gulp.src([
        'core-components/metric-dashboard/**/*.js',
    ])
      .pipe(order([
          '**/module.js'
      ]))
      .pipe(concat('dist.metricDashboard.module.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('metricDashboard.module.css', function () {
    return gulp.src([
        'core-components/metric-dashboard/**/*.css',
    ])
      .pipe(concat('dist.metricDashboard.css'))
      .pipe(gulp.dest('assets/css'));
});


//  Module
//  Report Viewer
gulp.task('reportViewer.module.js', function () {
    return gulp.src([
        'core-components/report-viewer/**/*.js',
    ])
      .pipe(order([
          '**/module.js'
      ]))
      .pipe(concat('dist.reportViewer.module.js'))
      .pipe(gulp.dest('assets/js'));
});
gulp.task('reportViewer.module.css', function () {
    return gulp.src([
        'core-components/report-viewer/**/*.css',
    ])
      .pipe(concat('dist.reportViewer.css'))
      .pipe(gulp.dest('assets/css'));
});


// Execute Default Tasks
gulp.task('default', [
    'libraries.js',
    'mapApp.module.js',
    'mapApp.module.css',
    'platformHome.module.js',
    'platformHome.module.css',
    'metricDashboard.module.js',
    'metricDashboard.module.css',
    'reportViewer.module.js',
    'reportViewer.module.css',
    ]);