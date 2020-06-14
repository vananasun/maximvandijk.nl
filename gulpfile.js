const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const browserify = require('browserify');
const src = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

/*******************************************************************************
 *
 * User defined variables
 *
 ******************************************************************************/
const paths = {
    html: {
        src: ["src/**/*.html", "src/tests/*.html"],
        dest: "build/"
    },
    js: {
        src: ["src/js/**/!(main)*.js", "src/js/**/main.js"],
        dest: "build/assets/js"
    },
    css: {
        src: ["src/css/**/*.scss", "src/css/**/*.css"],
        dest: "build/assets/css"
    }
};



/*******************************************************************************
 *
 * Tasks
 *
 ******************************************************************************/
function html() {
    return gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dest));
}

function css() {
    return gulp.src(paths.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.css.dest));
}

function js() {
    // Game code
    return browserify('./src/js/main.js', {
        paths: ['./src/js/']
      }).bundle()
        .pipe(src('alles-bundle.js'))
        .pipe(buffer())
        .pipe(concat('alles.min.js'))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest(paths.js.dest));
}

function testsJs() {
    return gulp.src(paths.js.srcTests).pipe(gulp.dest(paths.js.dest));
}

gulp.task('watch', function() {
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.js.src, js);
    gulp.watch(paths.css.src, css);
});

exports.js = js;
exports.css = css;
exports.html = html;
exports.default = gulp.parallel(html, js, css);
