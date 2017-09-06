/* eslint-disable */
var fs = require('fs-extra'),
    ngAnnotate = require('ng-annotate'),
    babel = require("babel-core"),
    UglifyJS = require('uglify-js'),
    glob = require('glob'),
    templatecache = require('ng-templatecache'),
    vendors = [
      "./node_modules/angular/angular.min.js",
      "./node_modules/@uirouter/angularjs/release/angular-ui-router.min.js"
    ],
    vendorCss  = [
      // "./node_modules/bootstrap/dist/css/bootstrap-reboot.min.css",
      "./node_modules/bootstrap/dist/css/bootstrap.min.css",
    ],
    srcDir   = __dirname + '/src',
    dist     = __dirname + '/public/vendor.js',
    distCss  = __dirname + '/public/vendor.css',
    app      = __dirname + '/public/app.js',
    appCss   = __dirname + '/public/app.css',
    index    = srcDir + '/index.html',
    distIndex= __dirname + '/public/index.html';

var babelOptions = {
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 8", "IE >= 10"]
      }
    }]
  ]
};

var globOptions = {
  cwd:srcDir,
  ignore:[
    '**/*.spec.js',
    'index.html',
  ]
};

var __PRO__ = !!(process.env.NODE_ENV === 'production' || process.argv[2]==='prod');
var src = '';
function build(skip_vendor){
  fs.ensureFileSync(distIndex);
  src = fs.readFileSync(index, "utf8");
  if(__PRO__){
    // run production code... not sure now what it is :D !!
    console.log('..production mode..');
    var p = src.split('<!--START_DEV-->');
    var p2 = p[1].split('<!--END_DEV-->')[1];
    fs.outputFileSync(distIndex, p[0]+p2);
    console.log('index.html updated');

  } else {
    fs.outputFileSync(distIndex, src); // copy as is
    vendors = vendors.map(i=>i.split('.min.js').join('.js')); // include whole file
  }

  // concat vendor.min files, and remove sourceMap
  if(!skip_vendor){
    fs.ensureFileSync(dist);
    fs.outputFileSync(dist, vendors.map(File => fs.readFileSync(File, "utf8")).join("\n").replace(/\/\/\# sourceMappingURL=.*.map/g,''));
    console.log('_vendor.js updated');
    // console.log('done concating vendor code');
    fs.ensureFileSync(distCss);
    fs.outputFileSync(distCss, vendorCss.map(File=>fs.readFileSync(File, "utf8")).join("\n").replace(/\/\/\# sourceMappingURL=.*.map/g,'').replace(/sourceMappingURL=.*.map/g,''));
    console.log('_vendor.css updated');
  }

  // prepare $templateCache
  var cache = templatecache({
      entries: glob.sync('**/*.html', globOptions).map(File=>({
        content: fs.readFileSync(srcDir+'/'+File, "utf8"),
        path: '/'+File,
      })),
      module: 'webtrekk',
      standalone: false,
  });
  cache = `
  (function(angular) {
    'use strict';
    ${cache}

  })(angular);
  `;
  console.log('html cache', cache);

  // prepare app js; and include $templateCache at end;
  var src = glob.sync('**/*.js', globOptions).map(File=>fs.readFileSync(srcDir+'/'+File, "utf8")).concat(cache).join("\n");
  src = babel.transform(src, babelOptions).code;
  src = ngAnnotate(src, {add:true, remove:true}).src;

  src = (__PRO__) ? UglifyJS.minify(src) : {code: src};

  if(!src.error && !src.warnings){
    fs.ensureFileSync(app);
    fs.outputFileSync(app, src.code);
    console.log('_app.js updated');
  } else {
    console.log('app.js failed');
    console.log(src);
  }

  // prepare css;
  src = glob.sync('**/*.css', globOptions).map(File=>fs.readFileSync(srcDir+'/'+File, "utf8")).join("\n")
  fs.ensureFileSync(appCss);
  fs.outputFileSync(appCss, src);
  console.log('_app.css updated');

}
console.log('Args::'+process.argv);
if(process.argv.length > 2){
  build(process.argv[2]==='skip');
}

module.exports = build;
/* eslint-enable */