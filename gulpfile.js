const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const merge = require('merge-stream');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserify = require('browserify');
const src = require('vinyl-source-stream');
sass.compiler = require('node-sass');



/***
 *
 * user defined variables
 *
 **/
const paths = {
    js: {
        entries: ["src/js/pages/simply-sanskrit.js", "src/js/pages/index.js", 'src/js/webgl-synth/webgl-synth.js'],
        watch: ["src/js/**/*.js"],
        dest: "public/js",
        includeDirs: [ './src/js/' ]
    },
    css: {
        src: ["src/css/*.scss", "src/css/*.css"],
        watch: ["src/css/**/*.scss", "src/css/*.css"],
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
    return merge(paths.js.entries.map(entry => {
        return browserify(entry, { paths: paths.js.includeDirs })
            .bundle()
            .pipe(src(entry))
            .pipe(rename({
                dirname: '',
                extname: '.min.js'
            }))
            .on('error', (err) => {
                console.log(err.toString());
                this.emit('end');
            })
            .pipe(gulp.dest('public/js'))
    }));
}



gulp.task('watch', function() {
    gulp.watch(paths.js.watch, js);
    gulp.watch(paths.css.watch, css);
});

exports.js = js;
exports.css = css;
exports.default = gulp.parallel( js, css );
