const gulp       = require('gulp');
const postcss    = require('gulp-postcss');
const size       = require('gulp-size');
const rename     = require('gulp-rename');
const imagemin   = require('gulp-imagemin');
const jscs       = require('gulp-jscs');
const reporter   = require('postcss-reporter');
const bemLinter  = require('postcss-bem-linter');
const stylelint  = require('stylelint');
const cssnext    = require('postcss-cssnext');
const atImport   = require('postcss-import');
const browserify = require('browserify');
const babelify   = require('babelify');
const watchify   = require('watchify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const del        = require('del');
const bs         = require('browser-sync').create();
const metalsmith = require('./Metalsmith');
const paths      = require('./paths');
const config     = require('./config');

// Configuration

const sizeConfig = {
  gzip: true,
  pretty: true,
  showFiles: true
};

// Content Tasks
/////////////////////

// Build Site through Metalsmith with presets
gulp.task('metalsmith', function () {
  metalsmith(false);
  setTimeout(()=> {
    bs.reload();
  }, 1000);
});

gulp.task('metalsmith:prod', metalsmith());

// Linting Tasks
/////////////////////

// Lint JavaScript with JSCS
gulp.task('lint:js', () => {
  return gulp.src(paths.js.src)
    .pipe(jscs());
});

// Lint CSS with Stylelint
gulp.task('lint:css', () => {
  const linters = [
    stylelint(),
    bemLinter('bem'),
    reporter({ clearMessages: true }),
  ];

  return gulp.src([paths.css.src, paths.css.all])
    .pipe(postcss(linters));
});

// Asset Tasks
/////////////////////

// CSS Compilation with PostCSS
gulp.task('styles', ['lint:css'], () => {
  const processors = [
    atImport,
    cssnext
  ];

  return gulp.src(paths.css.src)
    .pipe(postcss(processors))
    .pipe(rename('main.css'))
    .pipe(size(sizeConfig))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(bs.stream());
});

// Transpile JavaScript through Browserify with Babel
const bundler = watchify(browserify(paths.js.src, watchify.args));

function bundle() {
  return bundler
    .transform(babelify)
    .bundle()
    .pipe(source('./bundle.js'))
      .pipe(buffer())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(size(sizeConfig))
    .pipe(bs.stream());
};

bundler.on('update', bundle);
gulp.task('scripts', ['lint:js'], bundle);

// Optimize Images
gulp.task('images', () => {
  return gulp.src(paths.img.src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
    }))
    .pipe(size(sizeConfig))
    .pipe(gulp.dest(paths.img.dest))
    .pipe(bs.stream());
});

// Utility Tasks
/////////////////////

// rm -rf the Build directory
gulp.task('clean', () => {
  return del(paths.build);
});

// Watch files for changes
gulp.task('watch', () => {
  gulp.watch([paths.css.all], ['styles']);
  gulp.watch([paths.img.src], ['images']);
  gulp.watch([paths.js.all], ['scripts']);
  gulp.watch(['./content/**/*.md', './layouts/**/*.hbs'], ['metalsmith']);
});

// Starts Browser Sync Server
gulp.task('connect', () => {
  setTimeout(()=> {
    bs.init({
      server: {
        baseDir: paths.build
      }
    });
  }, 1000);
});

// Default Tasks
/////////////////////

gulp.task('assets', ['styles', 'images', 'scripts']);
gulp.task('build', ['metalsmith', 'assets']);
gulp.task('default', ['build', 'connect', 'watch']);
