'use strict';

// Include Gulp & Tools We'll Use
var gulp      = require('gulp'),
    $           = require('gulp-load-plugins')(),
    del         = require('del'),
    runSequence = require('run-sequence'),
    exec        = require('child_process').exec,
    path        = require('path'),
    connect = require('gulp-connect'),

// Task configuration.
    theme         = __dirname + '/',
    //styleguide    = __dirname + '/styleguide/',

// Get theme sub-directories from Compass' config.rb.
  compass       = require('compass-options').dirs({'config': theme + 'config.rb'});


// // Build styleguide.
// gulp.task('styleguide', $.shell.task([
//     // kss-node [source folder of files to parse] [destination folder] --template [location of template files]
//     'kss-node <%= source %> <%= destination %> --template <%= template %>'
//   ], {
//     templateData: {
//       source:       theme + compass.sass,
//       destination:  styleguide,
//       template:     styleguide + 'template'
//     }
//   }
// ));

// Lint JavaScript.
gulp.task('lint:js', function () {
  return gulp.src(theme + compass.js + '/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Lint Sass.
// gulp.task('lint:sass', function() {
//   return gulp.src(theme + compass.sass + '/**/*.scss')
//     .pipe($.scssLint({'bundleExec': true}));
// });

// Lint Sass and JavaScript.
// gulp.task('lint', function (cb) {
//   runSequence(['lint:js', 'lint:sass'], cb);
// });

// Build CSS.
gulp.task('styles', ['clean:css'], $.shell.task([
    'bundle exec compass compile --time --sourcemap --output-style expanded'
  ], {cwd: theme}
));

gulp.task('styles:production', ['clean:css'], $.shell.task([
    'bundle exec compass compile --time'
  ], {cwd: theme}
));

// Watch for front-end changes and rebuild on the fly.
gulp.task('watch', ['clean:css', 'watch:files'],
  // This task cannot be used in a dependency, since this task won't ever end
  // due to "compass watch" never completing.
  $.shell.task(
    ['bundle exec compass watch --time --sourcemap --output-style expanded'],
    {cwd: theme}
  )
);
gulp.task('watch:files', function() {
  return gulp.watch(theme + compass.sass + '/**/*.scss');
});

// Clean styleguide directory.
// gulp.task('clean:styleguide', del.bind(null, [styleguide + '*.html', styleguide + 'public'], {force: true}));

// Clean CSS directory.
gulp.task('clean:css', del.bind(null, [theme + '**/.sass-cache', theme + compass.css + '/**/*.css', theme + compass.css + '/**/*.map'], {force: true}));

// Clean all directories.
gulp.task('clean', ['clean:css']);

// Production build of front-end.
gulp.task('build', function (cb) {
  // @TODO Use the lint task instead of lint:sass after lint:js is improved.
  runSequence(['styles:production'], cb);
});

// The default task.
gulp.task('default', ['build']);


// Resources used to create this gulpfile.js:
// - https://github.com/google/web-starter-kit/blob/master/gulpfile.js
// - https://github.com/north/generator-north/blob/master/app/templates/Gulpfile.js
