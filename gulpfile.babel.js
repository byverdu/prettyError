import gulp from 'gulp';
require( 'require-dir' )( './build/tasks' );

gulp.task( 'default', [ 'serve', 'watch' ]);
