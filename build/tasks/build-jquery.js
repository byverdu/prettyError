const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const rename = require( 'gulp-rename' );
const minify = require( 'gulp-uglify' );
const stripLine  = require( 'gulp-strip-line' );
const paths = require( '../paths' );

gulp.task( 'minify', () => {
  gulp.src( paths.srcJquery )
    .pipe( rename({ suffix: '.min' }))
    .pipe( sourcemaps.init())
    .pipe( minify())
    .pipe( sourcemaps.write( '.' ))
    .pipe( gulp.dest( paths.destJs ));
});

gulp.task( 'move-js', [ 'minify' ], () => {
  gulp.src( paths.srcJquery )
  .pipe( stripLine([
    /^\/\*\s*global IprettyError \*\//,
    /^\/\*\s* \*\//
  ]))
    .pipe( gulp.dest( paths.destJs ));
});
