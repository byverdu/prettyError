const gulp = require( 'gulp' );
const cssnano = require( 'gulp-cssnano' );
const sourcemaps = require( 'gulp-sourcemaps' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );
const paths = require( '../paths' );

gulp.task( 'sass', () => {
  return gulp.src( paths.srcSass )
    .pipe( sass().on( 'error', sass.logError ))
    .pipe( gulp.dest( paths.destSass ));
});

gulp.task( 'css-minify', [ 'sass' ], () => {
  return gulp.src( paths.srcCss )
    .pipe( sourcemaps.init())
    .pipe( rename({ suffix: '.min' }))
    .pipe( cssnano())
    .pipe( sourcemaps.write( '.' ))
    .pipe( gulp.dest( paths.destCss ));
});

gulp.task( 'build-css', ['sass', 'css-minify']);
