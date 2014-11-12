var task = require('bud'),
    vinyl = require('vinyl-fs'),
    sass = require('gulp-sass'),
    sassets = require('dympl-sassets'),
    neat = sassets.neat,
    scss = sassets.scss,
    dympl = require('../dympl.json');

var src = vinyl.src('./src/scss/**');
var development = dympl.development || './development';
var production = dympl.production || './production';

var scssPath = neat.with(scss.bootstrap);

// node build/scss scss (prod=true)

task('scss', function(t) {

  var prod = (t.params.prod == 'true') ? true : false;

  var options = {
    includePaths: scssPath, 
    outputStyle: prod ? 'compressed' : 'nested'
  };

  var dest = prod ?
    production+'/css' : development+'/css';

  src.pipe(sass(options))
    .pipe(vinyl.dest(dest));

});
