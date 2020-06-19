var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(serve).listen(80);


function serve(request, response) {

    let dir;
    var requestUrl = url.parse(request.url)
    if (requestUrl.pathname === '/')
        requestUrl.pathname = 'index.html';


    // serve node module stuff
    if (requestUrl.pathname === '/htmlgl.min.js') {

        dir = __dirname + '/node_modules/';
        process.chdir(dir);
        requestUrl.pathname = 'html-gl/dist/htmlgl.min.js';

    } else {

        dir = __dirname + '/build/';
        process.chdir(dir);

    }



    response.writeHead(200)


    var stream = fs.createReadStream(dir + requestUrl.pathname);

    stream.on('error', function(err) {
        console.log(err.message, request.url);
        request.url = '/index.html';
        return serve(request, response);
        // response.writeHead(404, {"Content-Type": "text/plain"});
        // response.write(err.message);
        // response.end();
    });

    stream.on('open', function() {
        stream.pipe(response);
    });

}
