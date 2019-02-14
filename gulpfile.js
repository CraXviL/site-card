let syntax        = 'sass'; // Syntax: sass or scss;

let gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		babel         = require('gulp-babel');
		sourcemaps    = require('gulp-sourcemaps');
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		del          = require('del'),
		imagemin     = require('gulp-imagemin'),
		pngquant     = require('imagemin-pngquant'),
		cache        = require('gulp-cache'),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('libs', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/popover/popover.js',
		'app/libs/bootstrap4/js/dist/util.js',
		'app/libs/bootstrap4/js/dist/collapse.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', function() {
	return gulp.src(['app/js/scripts.js'])
	.pipe(concat('scripts.min.js'))
	.pipe(babel({
        presets: [
            ["env", { "modules": false }]
        ]
    }))
    .pipe(sourcemaps.write('scripts.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
});

exports.clean = del.bind(null, ['docs']);

gulp.task('watch', function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch('app/js/scripts.js', gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('styles', 'libs', 'scripts', 'browser-sync', 'watch'));

gulp.task('dest', function () {

    let cssDist = gulp.src([
        'app/css/style.min.css',
    ]).pipe(gulp.dest('docs/css'));
    let fontsDist = gulp.src('app/fonts/**/*').pipe(gulp.dest('docs/fonts'));
    let jsDist = gulp.src(['app/js/**/*', '!app/js/scripts.js']).pipe(gulp.dest('docs/js'));
    let htmlDist = gulp.src(['app/*.html', 'app/*.php']).pipe(gulp.dest('docs'));
    let htaccessDist = gulp.src(['app/.htaccess']).pipe(gulp.dest('docs'));
    let imgDist = gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('docs/img'));

    return cssDist, fontsDist, jsDist, htmlDist, htaccessDist, imgDist;

});

gulp.task('build', gulp.series('styles', 'scripts', 'dest'));