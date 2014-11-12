var task = require('bud');
var browserify = require('browserify');
var collapser = require('bundle-collapser/plugin');
var src = require('vinyl-source-stream');
var buf = require('vinyl-buffer');
var ugl = require('gulp-uglify');
var vinyl = require('vinyl-fs');
var sassets = require('dympl-sassets');

//Main Tasks

task('dev', task.once('dev-bundle', 'dev-fonts'));
task('prod', task.once('prod-bundle', 'prod-fonts'));

//Deps

var deps = require('../dympl.json').dependencies;
var jsdeps = deps.js || [];
var fontdeps = deps.fonts || [];

//Development

var dev = deps.development || './development';

task('fonts-dev', function() {
  var fontPaths = fontdeps.map(function(font) {
    if (typeof sassets.fonts[font] !== 'undefined')
      return sassets.fonts[font];
  });

  vinyl.src(fontPaths)
    .pipe(vinyl.dest(dev+'/fonts'));
});

task('bundle-dev', function() {
  var b = browserify();

  jsdeps.forEach(function(dep) {
    b.require(dep);
  });

  b.bundle()
    .pipe(src('deps-bundle.js'))
    .pipe(vinyl.dest(dev+'/js'));
});

//Production

var prod = deps.production || './production';

task('fonts-prod', function() {
  var fontPaths = fontdeps.map(function(font) {
    if (typeof sassets.fonts[font] !== 'undefined')
      return sassets.fonts[font];
  });

  vinyl.src(fontPaths)
    .pipe(vinyl.dest(prod+'/fonts'));
});

task('bundle-prod', function() {
  var b = browserify();

  jsdeps.forEach(function(dep) {
    b.require(dep);
  });

  b.transform('envify');
  b.plugin(collapser);
  b.bundle()
    .pipe(src('deps-bundle.js'))
    .pipe(buf())
    .pipe(ugl())
    .pipe(vinyl.dest(prod+'/js'));
});


