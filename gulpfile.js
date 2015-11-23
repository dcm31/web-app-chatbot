'use strict';

var config = require('./build/build.config.js');
var karmaConfig = require('./build/karma.config.js');
var protractorConfig = require('./build/protractor.config.js');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pkg = require('./package');
var karma = require('karma').server;
var del = require('del');
var _ = require('lodash');
var bump = require('gulp-bump');
var git = require('gulp-git');
var tag = require('gulp-tag-version');
var rename = require('gulp-rename');
var spawn = require('child_process').spawn;
/* jshint camelcase:false*/
var webdriverStandalone = require('gulp-protractor').webdriver_standalone;
var webdriverUpdate = require('gulp-protractor').webdriver_update;

//update webdriver if necessary, this task will be used by e2e task
gulp.task('webdriver:update', webdriverUpdate);

// run unit tests with travis CI
gulp.task('travis', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true,
    browsers: ['PhantomJS']
  }), cb);
});

// optimize images and put them in the dist folder
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.dist + '/assets/images'))
    .pipe($.size({
      title: 'images'
    }));
});

//generate angular templates using html2js
gulp.task('templates', function() {
  return gulp.src(config.tpl)
    .pipe($.changed(config.tmp))
    .pipe($.html2js({
      outputModuleName: 'templates',
      base: 'client',
      useStrict: true
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'templates'
    }));
});

//generate css files from scss sources
gulp.task('sass', function() {
  return $.rubySass(config.mainScss)
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'sass'
    }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence('jshint', 'build', 'test:unit', ['copy', 'copy:assets', 'images'], 'html', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['constants', 'sass', 'templates', 'browserify'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  var assets = $.useref.assets({
    searchPath: '{build,client}'
  });

  return gulp.src(config.index)
    .pipe(assets)
    .pipe($.if('**/*main.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify({
      mangle: false,
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
      pkg: pkg
    })))
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({
      empty: true
    })))
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'html'
    }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist + '/assets'))
    .pipe($.size({
      title: 'copy:assets'
    }));
});

//copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/*.html',
      '!' + config.base + '/src',
      '!' + config.base + '/test'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});

//clean temporary directories
gulp.task('clean', del.bind(null, [config.dist, config.tmp]));

//lint files
gulp.task('jshint', function() {
  return gulp.src(config.js)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('constants', function() {
  return $.ngConstant({
      name: 'constants',
      constants: {
        GET_RENT_ZESTIMATE_PORT: process.env.GET_RENT_ZESTIMATE_PORT,
        END_POINTS_HOST: process.env.END_POINTS_HOST,
        FIREBASE_URL: process.env.FIREBASE_URL,
        AMAZON_S3_PUBLIC_BUCKET: process.env.AMAZON_S3_PUBLIC_BUCKET,
        AMAZON_S3_PUBLIC_ACCESS_KEY: process.env.AMAZON_S3_PUBLIC_ACCESS_KEY,
        AMAZON_S3_PUBLIC_SECRET_KEY: process.env.AMAZON_S3_PUBLIC_SECRET_KEY,
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        IP_SERVER_PORT: process.env.IP_SERVER_PORT,
        SECURE_UPLOAD_SERVER_ENDPOINT: process.env.SECURE_UPLOAD_SERVER_ENDPOINT,
        PENDING_PROPERTY_CUTOFF: process.env.PENDING_PROPERTY_CUTOFF,
        BASE_URL: process.env.BASE_URL,
        TIMEZONE_OFFSET: 300 // EST
      },
      stream: true
    })
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'constants'
    }));
});

/* tasks supposed to be public */


//default task
gulp.task('default', ['serve']); //

//run unit tests and exit
gulp.task('test:unit', function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true
  }), cb);
});

// Run e2e tests using protractor, make sure serve task is running.
gulp.task('test:e2e', ['webdriver:update'], function() {
  return gulp.src(protractorConfig.config.specs)
    .pipe($.protractor.protractor({
      configFile: 'build/protractor.config.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});

//run the server,  watch for file changes and redo tests.
gulp.task('tdd', function(cb) {
  gulp.watch(config.js, ['test:unit']);
});

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['build'], function() {
  browserSync({
    notify: false,
    logPrefix: pkg.name,
    server: ['build', 'client']
  });

  gulp.watch(config.html, reload);
  gulp.watch(config.scss, ['sass', reload]);
  gulp.watch(config.js, ['jshint', 'browserify', reload]);
  gulp.watch(config.tpl, ['templates', reload]);
  gulp.watch(config.assets, reload);
});

//run the server,  watch for file changes and autorun tests.
gulp.task('tdd', function() {
  gulp.watch(config.js, ['test:unit']);
});


//run the app packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
  browserSync({
    notify: false,
    server: [config.dist]
  });
});

gulp.task('browserify', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  return gulp.src(['./client/src/**/*.js', '!./client/src/vendor/**/*.js'])
    .pipe($.plumber())
    .pipe(browserified)
    .pipe(gulp.dest(config.tmp))
});

function updateVersionNumber(type) {
  return gulp.src(['./package.json'])
    .pipe(bump({
      type: type
    }))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('chore(version): ' + type))
    .pipe(tag({
      prefix: ''
    }));
}

gulp.task('bump:patch', function() {
  return updateVersionNumber('patch');
})
gulp.task('bump:minor', function() {
  return updateVersionNumber('minor');
})
gulp.task('bump:major', function() {
  return updateVersionNumber('major');
})

gulp.task('new:component', function() {
  spawn('yo', [
    'le-directive'
  ], {
    stdio: 'inherit'
  });
});

gulp.task('new:service', function() {
  spawn('yo', [
    'le-factory'
  ], {
    stdio: 'inherit'
  });
});

gulp.task('new:page', function() {
  spawn('yo', [
    'le-page'
  ], {
    stdio: 'inherit'
  });
});
