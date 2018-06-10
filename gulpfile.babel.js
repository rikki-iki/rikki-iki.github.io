/**
 * @file
 * Defines tasks from imported functions.
 */

import gulp from 'gulp';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import size from 'gulp-size';
import del from 'del';
import sassLint from 'gulp-sass-lint';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import eyeglass from 'eyeglass';
import sassGlob from 'gulp-sass-glob';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import rollup from 'gulp-rollup-each';
import rollupBabel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let config = {};

try {
  // At this stage we are only using one gulpfile.yml.
  // If the need arises to have developer overrides for gulp config we can do this.
  config = yaml.safeLoad(fs.readFileSync('gulpfile.yml', 'utf8'), { json: true });

  // node-sass / eyeglass global config.
  // This is used by styles and styleguide.
  config.sassOptions = {
    includePaths: [
      config.sass.src,
      'node_modules',
    ],
    // We are using the standard expanded style for outputting all CSS.
    outputStyle: 'expanded',
    eyeglass: {
      // This is a little hacky and not entirely great however it's the best we
      // can do with the current asset management in eyeglass. All assets will get
      // an absolute path prefixed to them.
      httpRoot: `/${path.relative(config.httpRoot, config.sass.src)}`,
      assets: {
        // Add assets except for js, sass, and twig files.
        // The url passed to the sass asset-url() function should be relative to this directory.
        sources: [
          { directory: config.sass.src, globOpts: { ignore: ['**/*.js', '**/*.scss', '**/*.twig'] } },
        ],
      },
    },
  };

  // Config for gulp-dependents to include imported/dependent
  // files in our watch stream. Used in conjunction with gulp-cached
  // means we're only watching files that need to change.
  config.dependents = {
    '.scss': {
      parserSteps: [
        // Find everything inside single quotes from lines
        // starting with '@import' and ending in ';'.
        /^\s*@import\s*.*'(.+?)';$/gm,
        (str) => {
          if (!str.match(/^[\.]/gm)) {
            // Sass file imports assume the sass src path is already attached.
            const src = path.resolve(config.sass.src);
            str = path.join(src, str);
          }
          return [str];
        },
      ],
      prefixes: ['_'],
      postfixes: ['.scss'],
      basePaths: [],
    },
    '.js': {
      parserSteps: [
        // Find everything inside single quotes from lines
        // starting with 'import' and ending in ';'.
        /^\s*import\s*.*'(.+?)';$/gm,
      ],
      prefixes: [],
      postfixes: ['.js'],
      basePaths: [],
    },
  };
}
catch (e) {
  console.log('gulpfile.yml not found!');
}

const files = {
  js: [
    `${config.js.src}/**/*.es6.js`,
    // Ignore already minified files.
    `!${config.js.src}/**/*.min.js`,
    // Ignore webpack bundled files
    `!${config.js.src}/**/*.bundle.js`,
  ],

  minify: [
    `${config.js.src}/**/*.bundle.js`,
  ],

  sass: [
    `${config.sass.src}/**/*.scss`,
    `!${config.sass.src}/**/vendor/*.scss`,
  ],

  gulp: [
    'gulpfile.babel.js',
  ],
};


/**
 * *****
 * CLEAN
 * *****
 */


// Define the globs to delete (or leave alone).
const cleanFiles = {
  css: [
    `${config.sass.dest}/**/*.css`,
    `${config.sass.dest}/**/*.map`,
  ],

  js: [
    `${config.js.dest}/**/*.min.js`,
    `${config.js.modules}/**/*.min.js`,
    `!${config.js.dest}/**/vendor/*.min.js`,
    `!${config.js.dest}/**/vendor/**/*.min.js`,
    `!${config.js.modules}/**/vendor/*.min.js`,
    `!${config.js.modules}/**/vendor/**/*.min.js`,
  ],
};

/**
 * Clean the SASS destination directory, except styleguide styles.
 * @return {object} css
 */
const delCss = () => del(cleanFiles.css, { force: true });

delCss.description = 'Clean the SASS destination directory.';
gulp.task('clean:css', delCss);

/**
 * Clean the Minfied JS destination directory, except vendor files.
 * @return {object} js
 */
const delJs = () => del(cleanFiles.js, { force: true });

delJs.description = 'Clean the JS destination directory.';
gulp.task('clean:js', delJs);

/**
 * Clean the cache.
 * @return {object} cache
 */
const delCache = () => (cached.caches === {});

delCache.description = 'Clean the cache.';
gulp.task('clean:cache', delCache);

/**
 * Clean everything.
 */
const clean = gulp.series('clean:js', 'clean:css');
clean.description = 'Clean everything.';
gulp.task('clean', clean);


/**
 * ****
 * LINT
 * ****
 */


/**
 * Lint JS.
 * @return {object} js
 */
const lintJs = () => (
  gulp.src(files.js)
    .pipe(cached('lint'))
    .pipe(eslint())
    .pipe(eslint.format())
);

lintJs.description = 'Lints all JS src files.';
gulp.task('lint:js', lintJs);

/**
 * Lint JS (with fail).
 * @return {object} jsWith Fail
 */
const lintJsWithFail = () => (
  gulp.src(files.js)
    .pipe(cached('lint'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
);

lintJsWithFail.description = 'Lints all JS src files, and fail on an error.';
gulp.task('lint:js-with-fail', lintJsWithFail);

/**
 * Fix as many JS Lint issues as possible.
 * @return {object} fixJs
 */
const fixJs = () => (
  gulp.src(files.js, { base: './' })
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulp.dest('./'))
);

fixJs.description = 'Lints all JS src files.';
gulp.task('lint:js-fix', fixJs);

/**
 * Lint Sass.
 * @return {object} sass
 */
const lintSass = () => (
  gulp.src(files.sass)
    .pipe(cached('lint'))
    .pipe(sassLint())
    .pipe(sassLint.format())
);

lintSass.description = 'Lints all Sass src files.';
gulp.task('lint:sass', lintSass);

/**
 * Lint Sass (with fail).
 * @return {object} sassWithFail
 */
const lintSassWithFail = () => (
  gulp.src(files.sass)
    .pipe(cached('lint'))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

lintSassWithFail.description = 'Lints all Sass src files, and fail on an error.';
gulp.task('lint:sass-with-fail', lintSassWithFail);

/**
 * Lint Gulpfiles.
 */
const lintGulp = () => (
  gulp.src(files.gulp, { base: './' })
    .pipe(eslint({
      fix: true,
      rules: {
        'import/no-extraneous-dependencies': [0],
        'no-unused-vars': [0],
        'func-names': [0],
        'no-confusing-arrow': [0],
        'no-console': [0],
        'import/no-mutable-exports': [0],
      },
    }))
    .pipe(eslint.format())
    .pipe(gulp.dest('./'))
);

lintGulp.description = 'Lints all JS gulp files.';
gulp.task('lint:gulp', lintGulp);

/**
 * Run both linters in series.
 */
const lint = gulp.series('lint:sass', 'lint:js');
lint.description = 'Lint Sass and JS.';
gulp.task('lint', lint);

/**
 * Run both linters in series (with fail).
 */
const lintWithFail = gulp.series('lint:sass-with-fail', 'lint:js-with-fail');
lintWithFail.description = 'Lint Sass and JS, and fail on an error.';
gulp.task('lint:with-fail', lintWithFail);


/**
 * ****
 * SYNC
 * ****
 */


 /**
 * Start Browsersync.
 * @param {function} done - Callback
 */
const init = (done) => {
  browserSync.init({
    proxy: config.developmentUrl,
    host: config.developmentUrl,
    open: false,
  });
  done();
};

init.description = 'Start Browsersync.';
gulp.task('browsersync:init', init);

/**
 * Reload Browsersync.
 * @param {function} done - Callback
 */
const reload = (done) => {
  browserSync.reload();
  done();
};

reload.description = 'Reload Browsersync.';
gulp.task('browsersync:reload', reload);


/**
 * *****
 * STYLE
 * *****
 */


/**
 * Outputs CSS only.
 * @return {object} production
 */
const styles = () => (
  gulp.src(files.sass)
    .pipe(cached('styles:production'))
    .pipe(dependents(config.dependents))
    .pipe(sassGlob())
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: config.browsers.sass }))
    .pipe(cleanCSS())
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.sass.dest))
);

styles.description = 'Outputs CSS ready for production.';
gulp.task('styles:production', gulp.series('clean:css', styles));

/**
 * Outputs CSS and sourcemaps.
 * @return {object} development
 */
const stylesDev = () => (
  gulp.src(files.sass)
    .pipe(cached('styles:development'))
    .pipe(dependents(config.dependents))
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: config.browsers.sass }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.stream({ match: '**/*.css' }))
);

stylesDev.description = 'Output CSS and sourcemaps for development use only.';
gulp.task('styles:development', stylesDev);


/**
 * ******
 * SCRIPT
 * ******
 */


/**
 * Filename for bundle task.
 * @return {object} file
 */
const bundleName = (file) => {
  file.basename = file.basename.replace('.es6', '');
  file.extname = '.bundle.js';
  return file;
};

/**
 * Filename for minify task.
 * @return {object} file
 */
const minifyName = (file) => {
  file.basename = file.basename.replace('.bundle', '');
  file.extname = '.min.js';
  return file;
};

/**
 * Bundle import scripts.
 * Only needs to run on files utilising ES6 imports.
 * @return {object} bundleJs
 */
const bundle = () => (
  gulp.src(files.js, { base: './' })
    .pipe(cached('scripts:bundle'))
    .pipe(dependents(config.dependents))
    .pipe(rollup({
      plugins: [
        resolve(),
        commonjs(),
        rollupBabel({
          presets: [['env', {
            modules: false,
            useBuiltIns: true,
            targets: { browsers: config.browsers.js },
          }]],
          babelrc: false,
          plugins: ['external-helpers'],
        }),
      ],
    }, (file) => {
      const thisFile = bundleName(file);
      return {
        format: 'umd',
        name: path.basename(thisFile.path),
      };
    }))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest('./'))
);

bundle.description = 'Bundle javascript modules.';
gulp.task('scripts:bundle', bundle);

/**
 * Minify
 * Keeps an original in the src and adds the minified file to dest.
 * @return {object} minify
 */
const minify = () => (
  gulp.src(files.minify)
    .pipe(cached('scripts:minify'))
    .pipe(uglify())
    .pipe(rename(file => (minifyName(file))))
    .pipe(size({ showFiles: true, showTotal: false }))
    .pipe(gulp.dest(config.js.dest))
);

minify.description = 'Minify theme javascript.';
gulp.task('scripts:minify', minify);

/**
 * Development JS.
 * Runs both without minification for easier debugging.
 * @return {object} minifyDev
 */
const minifyDev = () => (
  gulp.src(files.minify)
    .pipe(cached('scripts:minify-dev'))
    .pipe(rename(file => (minifyName(file))))
    .pipe(gulp.dest(config.js.dest))
);

minifyDev.description = 'Dev-minify javascript.';
gulp.task('scripts:minify-dev', minifyDev);

/**
 * Run both production scripts in series.
 */
const scripts = gulp.series('clean:js', 'scripts:bundle', 'scripts:minify');
scripts.description = 'Bundle, transpile and minify production js.';
gulp.task('scripts:production', scripts);

/**
 * Run both development scripts in series.
 */
const scriptsDev = gulp.series('scripts:bundle', 'scripts:minify-dev');
scriptsDev.description = 'Bundle and transpile development js.';
gulp.task('scripts:development', scriptsDev);


/**
 * *****
 * WATCH
 * *****
 */

 
// Watch options.
const watchOptions = {
  // This is required for watching to work inside vagrant.
  usePolling: true,
};

/**
 * Watch sass files.
 *
 * Reload browserSync automatically after a change to a sass file.
 */
const watchSass = () => gulp.watch(files.sass, watchOptions, gulp.series('lint:sass', 'styles:development', 'browsersync:reload'));

watchSass.description = 'Watch scss files and rebuild styles, with linting.';
gulp.task('watch:sass', watchSass);

/**
 * Watch js files.
 *
 * Reload browserSync automatically after a change to a js file.
 */
const watchJs = () => gulp.watch(files.js, watchOptions, gulp.series('lint:js', 'scripts:development', 'browsersync:reload'));

watchJs.description = 'Watch js files and lint and bundle them.';
gulp.task('watch:js', watchJs);

/**
 * Watch all.
 */
const watch = gulp.series('styles:development', 'scripts:development', 'browsersync:init', 'lint', gulp.parallel('watch:sass', 'watch:js'));
watch.description = 'Watch styles and js files and rebuild as needed on change.';
gulp.task('watch', watch);


/**
 * *****
 * BUILD
 * *****
 */

 
const build = gulp.series('styles:production', 'scripts:production');
build.description = 'Build all styles and scripts (for production).';
gulp.task('build', build);

// Set the default task to build.
gulp.task('default', build);