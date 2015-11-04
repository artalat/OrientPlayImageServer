'use strict';

var express, app, ir, env, Img, streams;

express = require('express');
app     = express();
ir      = require('image-resizer');
env     = ir.env;
Img     = ir.img;
streams = ir.streams;

if (env.development) {
  var exec = require('child_process').exec;
  var chalk = require('chalk');

  require('dotenv').load();

  // check to see if vips is installed
  exec ('vips --version', function (err, stdout, stderr) {
    if (err || stderr) {
      console.error(
        chalk.red('\nMissing dependency:'),
        chalk.red.bold('libvips')
      );
      console.log(
        chalk.cyan('  to install vips on your system run:'),
        chalk.bold('./node_modules/image_resizer/node_modules/sharp/preinstall.sh\n')
      );
    }
  });
}

app.directory = __dirname;
ir.expressConfig(app);

app.get('/favicon.ico', function (request, response) {
  response.sendStatus(404);
});

/**
Return the modifiers map as a documentation endpoint
*/
app.get('/modifiers.json', function(request, response){
  response.json(ir.modifiers);
});


/**
Some helper endpoints when in development
*/
if (env.development){
  // Show a test page of the image options
  app.get('/test-page', function(request, response){
    response.render('index.html');
  });

  // Show the environment variables and their current values
  app.get('/env', function(request, response){
    response.json(env);
  });
}



app.get('/custom/*?', function(request, response){
    var path = request.path.substring("/custom".length);
    processPath(path, request, response);
});

app.get('/:type/:variant/:path', function(request, response) {
    var variants = require("./variants.config");
    var params = request.params;

    var variant;

    try {
        var variant = variants[params.type][params.variant];
    }
    catch (e) {
        return response.send(404);
    }

    if (!variant && params.variant != "original")
        return response.send(404);

    var path;

    if (params.variant == "original")
        path = params.path;
    else
        path = variant + "/" + params.path;

    processPath(path, request, response);
});

function processPath (path, request, response) {
    var image = new Img({path: path});

    console.log(image);

    image.getFile()
        .pipe(new streams.identify())
        .pipe(new streams.resize())
        .pipe(new streams.filter())
        .pipe(new streams.optimize())
        .pipe(streams.response(request, response));
}

/*
Return an image modified to the requested parameters
  - request format:
    /:modifers/path/to/image.format:metadata
    eg: https://my.cdn.com/s50/sample/test.png
*/
// app.get('/*?', function(request, response){
//   var image = new Img(request);

//   console.log("getFile", image)

//   image.getFile()
//     .pipe(new streams.identify())
//     .pipe(new streams.resize())
//     .pipe(new streams.filter())
//     .pipe(new streams.optimize())
//     .pipe(streams.response(request, response));
// });


/**
Start the app on the listed port
*/
var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
