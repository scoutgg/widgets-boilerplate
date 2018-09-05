const gulp = require('gulp')
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const rename = require('gulp-rename')

gulp.task('default', function () {
    return browserify('src/index.js')
        .transform('babelify', {
            global: true,
            presets: ['@babel/env'],
            "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
        })
        .bundle()
        .pipe(source('application.js')) // Converts To Vinyl Stream
        .pipe(buffer()) // Converts Vinyl Stream To Vinyl Buffer
        // Gulp Plugins Here!
        .pipe(gulp.dest('build'));
});
