var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(serve).listen(80);


function serve(request, response) {
    var requestUrl = url.parse(request.url)
    if (requestUrl.pathname === '/')
        requestUrl.pathname = 'index.html';
    response.writeHead(200)

    let dir = __dirname + '/build/';
    process.chdir(dir);

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
