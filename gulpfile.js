const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const browserify = require('browserify');
const src = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

/***
 *
 * user defined variables
 *
 **/
const paths = {
    js: {
        src: ["src/js/**/!(main)*.js", "src/js/**/main.js"],
        dest: "public/js"
    },
    css: {
        src: ["src/css/*.scss", "src/css/*.css"],
        srcWatch: ["src/css/**/*.scss", "src/css/*.css"],
        dest: "public/css"
    }
};



/***
 *
 * tasks
 *
 **/
function css() {
    return gulp.src(paths.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.css.dest));
}

function js() {
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


gulp.task('watch', function() {
    gulp.watch(paths.js.src, js);
    gulp.watch(paths.css.srcWatch, css);
});

exports.js = js;
exports.css = css;
exports.default = gulp.parallel( js, css);
