'use strict';
// generated on 2014-07-01 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var gutil = require('gulp-util');

// load plugins
var $ = require('gulp-load-plugins')();

// browserify stuff
var browserify = require('browserify');

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe(
      $.rubySass({
        style: 'expanded',
        precision: 10
      }).on('error', gutil.log)
    )
    .pipe($.autoprefixer('last 3 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

gulp.task('scripts', function() {
  return gulp.src('./app/scripts/app.jsx')
    .pipe(
      $.browserify({
        transform: ['reactify'],
        extensions: ['.jsx']
      })
      .on('error', gutil.log)
    )
    .pipe($.concat('bundle.js'))
    .pipe(gulp.dest('./app/.tmp/'));
});

gulp.task('test', function() {
  return gulp.src('test/specs.js', {read: false})
    .pipe(
      $.browserify({
        transform: ['reactify'],
        extensions: ['.jsx']
      })
    )
    .pipe($.concat('test-suite.js'))
    .pipe(gulp.dest('.tmp/'))
    .pipe(
      $.karma({
        configFile: 'karma.conf.js',
        action: 'run'
      })
    );
});

gulp.task('watch-test', function() {
  return gulp.watch(['app/scripts/**', 'test/**/*.js'], ['test']);
});

gulp.task('html', ['styles', 'scripts'], function() {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src('app/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

gulp.task('fonts', function() {
  return $.bowerFiles()
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('extras', function() {
  return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('connect', function() {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({ port: 35729 }))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    .use(connect.directory('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'styles', 'scripts'], function() {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      exclude: ['bootstrap-sass-official']
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function() {
  var server = $.livereload();

  // watch for changes

  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/scripts/**/*.jsx',
    'app/images/**/*'
  ]).on('change', function(file) {
    server.changed(file.path);
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/scripts/**/*.jsx', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
