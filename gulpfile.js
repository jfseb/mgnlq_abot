/*
var ts = require("gulp-typescript")

// according to https://www.npmjs.com/package/gulp-typescript
// not supported
var tsProject = ts.createProject('tsconfig.json', { inlineSourceMap : false })

*/
// gulp.task('scripts', function() {
//    var tsResult = tsProject.src() // gulp.src("lib/*  * / * .ts") // or tsProject.src()
//        .pipe(tsProject())
//
//    return tsResult.js.pipe(gulp.dest('release'))
// })
//

var gulp = require('gulp');

var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

/**
 * Directory containing generated sources which still contain
 * JSDOC etc.
 */
var srcDir = 'src';
var testDir = 'test';

gulp.task('watch', function () {
  gulp.watch([srcDir + '/**/*.js', testDir + '/**/*.js', srcDir + '/**/*.tsx',  srcDir + '/**/*.ts', 'gulpfile.js'],
    ['tsc', 'babel', 'eslint']);
});

const babel = require('gulp-babel');

/**
 * Definition files
 */
gulp.task('tsc_d_ts', ['babel'], function () {
  var tsProject = ts.createProject('tsconfig.json', { inlineSourceMap: true
  });
  var tsResult = tsProject.src() // gulp.src('lib/*.ts')
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(tsProject());
  return tsResult.dts
    .pipe(gulp.dest('js'));
});
/**
 * compile tsc (including srcmaps)
 * @input srcDir
 * @output genDir
 */
gulp.task('tsc', function () {
  var tsProject = ts.createProject('tsconfig.json', { inlineSourceMap: true });
  var tsResult = tsProject.src() // gulp.src('lib/*.ts')
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(tsProject());

  return tsResult.js
//    .pipe(babel({
//      comments: true,
//      presets: ['es2015']
//    }))
    // .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
    .pipe(sourcemaps.write('.',{
      sourceRoot : function(file) {
        file.sourceMap.sources[0] = '/projects/nodejs/botbuilder/fdevstart/src/' + file.sourceMap.sources[0];
        //console.log('here is************* file' + JSON.stringify(file, undefined, 2));
        return 'ABC';
      },
      mapSources: function(src) {
        console.log('here we remap' + src);
        return '/projects/nodejs/botbuilder/fdevstart/' + src;
      }}
      )) // ,  { sourceRoot: './' } ))
      // Now the sourcemaps are added to the .js file
    .pipe(gulp.dest('js'));
});

var del = require('del');

gulp.task('clean:models', function () {
  return del([
    'sensitive/_cachefalse.js.zip',
    'node_modules/abot_testmodel/testmodel/_cachefalse.js.zip',
  ]);
});

gulp.task('clean', ['clean:models']);

var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
  gulp.src([srcDir + '/**/*.js', 'README.md', './js/**/*.js'], { read: false })
    .pipe(jsdoc(cb));
});

// gulp.task('copyInputFilterRules', ['tsc', 'babel'], function () {
//  return gulp.src([
//    genDir + '/match/inputFilterRules.js'
//  ], { 'base': genDir })
//    .pipe(gulp.dest('gen_cov'));
// });


var newer = require('gulp-newer');

var imgSrc = 'src/**/*.js';
var imgDest = 'js';

// compile standard sources with babel,
// this takes care of copying plain js files from src to dest
//
gulp.task('babel', ['tsc'], function () {
  // Add the newer pipe to pass through newer images only
  return gulp.src([imgSrc, 'gen_tsc/**/*.js'])
    .pipe(newer(imgDest))
    .pipe(babel({
      comments: true,
      presets: ['es2015']
    }))
    .pipe(gulp.dest('js'));
});

//const replace = require('gulp-replace');
// compile standard sources with babel,
// as the coverage input requires this
//
gulp.task('copyeliza', function () {
  // Add the newer pipe to pass through newer images only
  return gulp.src(['node_modules/elizabot/elizabot.js'])
    //.pipe(replace(/elizadata.jsfoo(.{3})/g, '$1foo'))
    .pipe(gulp.dest('js/extern/elizabot'));
});

/*
gulp.task('copyelizacov', function () {
  // Add the newer pipe to pass through newer images only
  return gulp.src(['node_modules/elizabot/elizabot.js'])
  //  .pipe(replace(/elizadata.jsfoo(.{3})/g, '$1foo'))
    .pipe(gulp.dest('gencov/extern/elizabot/'));
});
*/

var nodeunit = require('gulp-nodeunit');
//var env = require('gulp-env');

/**
 * This does not work, as we are somehow unable to
 * redirect the lvoc reporter output to a file
 */
/*
gulp.task('testcov', ['copyelizacov'], function () {
  const envs = env.set({
    FSD_COVERAGE: '1',
    FSDEVSTART_COVERAGE: '1'
  });
  // the file does not matter
  gulp.src(['./ ** /match/dispatcher.nunit.js'])
    .pipe(envs)
    .pipe(nodeunit({
      reporter: 'lcov',
      reporterOptions: {
        output: 'testcov'
      }
    })).pipe(gulp.dest('./cov/lcov.info'));
});
*/

gulp.task('test', ['tsc', 'babel', 'copyeliza'], function () {
  gulp.src(['test/**/*.js'])
    .pipe(nodeunit({
      reporter: 'minimal'
      // reporterOptions: {
      //  output: 'testcov'
      // }
    })).on('error', function (err) { console.log('This is weird: ' + err.message); })
    .pipe(gulp.dest('./out/lcov.info'));
});

gulp.task('testmin', ['tsc', 'babel'], function () {
  gulp.src(['test/**/*.js'])
    .pipe(nodeunit({
      reporter: 'minimal'
      // reporterOptions: {
      //  output: 'testcov'
      // }
    })).on('error', function (err) { console.log('This is weird: ' + err.message); })
    .pipe(gulp.dest('./out/lcov.info'));
});

const eslint = require('gulp-eslint');

gulp.task('eslint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['src/**/*.js', 'test/**/*.js', 'gulpfile.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

// we don't use this'
/*
var coveralls = require('gulp-coveralls');

gulp.task('coveralls', function () {
  gulp.src('testcov/ *    * /lcov.info')
    .pipe(coveralls());
});
*/

// Default Task
gulp.task('default', ['tsc', 'tsc_d_ts', 'babel', 'eslint', 'doc', 'test']);
gulp.task('build', ['tsc', 'babel', 'eslint']);
gulp.task('allhome', ['default']);
