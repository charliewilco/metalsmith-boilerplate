const gulp       = require('gulp');
const postcss    = require('gulp-postcss');
const size       = require('gulp-size');
const rename     = require('gulp-rename');
const imagemin   = require('gulp-imagemin');
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

const processors = [
  cssnext,
  atImport
];

gulp.task('styles', ()=> {
  return gulp.src(paths.css.src)
    .pipe(postcss(processors))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(paths.css.dest));
});

const bundler = watchify(browserify(paths.js.src, watchify.args));

function bundle() {
  return bundler
    .transform(babelify)
    .bundle()
    .pipe(source('./bundle.js'))
      .pipe(buffer())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(size({ showFiles: true }));
};

gulp.task('scripts', bundle);
bundler.on('update', bundle);

gulp.task('images', ()=> { });

gulp.task('metalsmith', metalsmith());
gulp.task('metalsmith:prod', metalsmith(true));

gulp.task('watch', ()=> {

});

gulp.task('connect', () => {
  bs.init({
    server: {
      baseDir: paths.build
    }
  });
});

gulp.task('assets', ['styles', 'images', 'scripts', 'icons']);
gulp.task('build', ['metalsmith', 'assets']);
gulp.task('default', ['build', 'watch', 'connect']);
