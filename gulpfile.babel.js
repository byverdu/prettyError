import gulp from 'gulp';
require( 'require-dir' )( './build/tasks' );

gulp.task( 'build', [
  'build-js',
  'build-css'
]);

gulp.task( 'default', [ 'build']);
gulp.task( 'tests', [ 'serve-test', 'watch-test' ]);
gulp.task( 'docs', [ 'serve-docs', 'watch-docs' ]);
