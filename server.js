var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(function (request, response) {
    var requestUrl = url.parse(request.url)
    response.writeHead(200)

    let dir = __dirname + '/build/';
    process.chdir(dir);

    var stream = fs.createReadStream(dir + requestUrl.pathname);

    stream.on('error', function(err) {
        console.log(err.message);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write(err.message);
        response.end();
    });

    stream.on('open', function() {
        stream.pipe(response);
    });

}).listen(8888);
