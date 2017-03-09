const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      useref = require('gulp-useref'),
      uglify = require('gulp-uglify'),
      gulpIf = require('gulp-if'),
      cssnano = require('gulp-cssnano'),
      runSequence = require('run-sequence'),
      prefix = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      postcss = require('gulp-postcss'),
      del = require('del');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});


gulp.task('prefix', () => {
  return gulp.src('app/css/*.css')
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('app/postcss'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('useref', () => {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(sourcemaps.init())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('releas'))
});

gulp.task('clean:releas', () => {
  return del.sync('releas');
});

gulp.task('copy:assets', () => {
  gulp.src(['./app/public/**.*', './app/vendor/**.*'], {base: './app'})
    .pipe(gulp.dest('releas'));
});

gulp.task('default', ['browser-sync', 'prefix'], () => {
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/css/*.css', ['prefix']);
  gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('build', (callback) => {
  runSequence('clean:releas', 'copy:assets', 'useref', callback)
});