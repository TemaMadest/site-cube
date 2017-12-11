"use strict";

var gulp = require('gulp'),
		watch = require('gulp-watch'),
		uglify = require('gulp-uglify'),
		sourcemaps = require('gulp-sourcemaps'),
		less = require('gulp-less'),
		rename = require('gulp-rename'),
		rigger = require('gulp-rigger'),
		cssmin = require('gulp-cssmin'),
		LessPluginAutoPrefix = require('less-plugin-autoprefix'),
		autoprefix = new LessPluginAutoPrefix({browsers: ["last 2 versions"]}),
		browserSync = require("browser-sync"),
		reload = browserSync.reload;

var path = {
    dist: { 
        js: 'dist/',
        css: 'dist/'
    },
    src: {
        js: 'src/build.js',
        less: 'src/build.less'
    },
    watch: { 
        js: 'src/**/*.js',
        css: 'src/**/*.less'
    }
};

var ServerConfig = {
	server: {
		baseDir: ""
	},
	//tunnel: true,
	host: 'localhost',
	port: 8000,
	open: true,
	notify: false,
	logPrefix: "madest"
};

gulp.task('browserSync', function () {browserSync(ServerConfig);});

gulp.task('watcher', function(){
	gulp.watch(path.watch.css, ['less']);
    gulp.watch(path.watch.js, ['js']);
    gulp.watch('index.html', ['index']);
});

gulp.task('js', function () {
	return gulp
		.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())	
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.dist.js))
		.pipe(reload({stream: true}));
});

gulp.task('less', function() {
	return gulp
		.src(path.src.less)
		.pipe(rigger())	
		.pipe(sourcemaps.init())
		.pipe(less({plugins: [autoprefix]}))
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.dist.css))
		.pipe(reload({stream: true}));
});

gulp.task('index', function(){
	return gulp
		.src('index.html')
		.pipe(reload({stream:true}));
});

gulp.task('default', ["less", "js", "watcher", "browserSync"]);