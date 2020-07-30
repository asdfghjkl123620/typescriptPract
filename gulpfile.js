//當您運行Gulp時，它將啟動並保持運行狀態。嘗試更改showHelloin 的代碼main.ts並保存
//將code和Browserify和tsifybundle再一起，可使用browserify插件將各種功能添加到我們的構建中
// Watchify將啟動gulp並使其保持運行，並在保存文件時逐步進行編譯。這樣，您就可以在瀏覽器中保持“編輯-保存-刷新”週期。

// Babel是一款非常靈活的編譯器，可將ES2015及更高版本轉換為ES5和ES3。這使您可以添加TypeScript不支持的廣泛且自定義的轉換。

// Uglify會壓縮您的代碼，以減少下載時間。

var gulp = require('gulp');
// var ts = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// var watchify = require('watchify');
// var fancy_log = require('fancy-log');

var tsify = require('tsify');
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
// var tsProject = ts.createProject('tsconfig.json');

var paths = {
    pages: ['src/*.html']
};
//將browserify實例包裝在對的調用中watchify，然後保留結果
//必須將調用browserify移出default任務
// var watchedBrowserify = watchify(browserify({
//     basedir: '.',
//     debug: true,
//     entries: ['src/main.ts'],
//     cache: {},
//     packageCache: {}
// }).plugin(tsify));


//添加copy-html任務並將其添加為的依賴項default
gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});









// function bundle() {
//     return watchedBrowserify
//     .bundle()
//     .on('error', fancy_log)
//     .pipe(source('bundle.js'))
//     .pipe(gulp.dest('dist'));
// }
// //必須給函數default命名，因為Watchify和Gulp都需要調用它
// gulp.task('default', gulp.series(gulp.parallel('copy-html'), bundle));
// //進行了調用，watchedBrowserify.on('update', bundle);
// //以便bundle每次您的TypeScript文件發生更改時，Browserify都將運行該函數。
// //必須將調用browserify移出default任務
// watchedBrowserify.on('update', bundle);
// //called watchedBrowserify.on('log', fancy_log); to log to the console.
// watchedBrowserify.on('log', fancy_log);


//babelify tranlate
//還需要具有TypeScript目標ES2015修改tsconfig.json
gulp.task('default', gulp.series(gulp.parallel('copy-html'), function () {
    return browserify({
        basedir: '.',
        debug: true,//debugBrowserify將導致tsify在捆綁的JavaScript文件中發出源映射
        //源映射使您可以在瀏覽器中調試原始的TypeScript代碼，而不是捆綁的JavaScript
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    //對buffer和sourcemaps的調用，以確保源映射可以正常工作
    //這些調用為我們提供了一個單獨的源地圖文件，而不是像以前那樣使用內聯源地圖
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
    //default使用tsify插件而不是gulp-typescript調用Browserify
    //bundle我們使用source（我們的Vinyl-source-stream別名）命名輸出包bundle.js
}));







//任何時間default都在運行，copy-html必須先運行
// gulp.task('default', gulp.series(gulp.parallel('copy-html'), function () {
//     return browserify({
//         basedir: '.',
//         debug: true,//debugBrowserify將導致tsify在捆綁的JavaScript文件中發出源映射
//         //源映射使您可以在瀏覽器中調試原始的TypeScript代碼，而不是捆綁的JavaScript
//         entries: ['src/main.ts'],
//         cache: {},
//         packageCache: {}
//     })
//     .plugin(tsify)
//     .bundle()
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     //對buffer和sourcemaps的調用，以確保源映射可以正常工作
//     //這些調用為我們提供了一個單獨的源地圖文件，而不是像以前那樣使用內聯源地圖
//     .pipe(sourcemaps.init({loadMaps: true}))
//     .pipe(uglify())
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('dist'));
//     //default使用tsify插件而不是gulp-typescript調用Browserify
//     //bundle我們使用source（我們的Vinyl-source-stream別名）命名輸出包bundle.js
// }));
// gulp.task('default', function () {
//     return tsProject.src()
//     .pipe(tsProject())
//     .js.pipe(gulp.dest('dist'));
// });