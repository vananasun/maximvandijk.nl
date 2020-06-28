var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(function (request, response) {
    var requestUrl = url.parse(request.url)
    response.writeHead(200)

    process.chdir(__dirname);
    var stream = fs.createReadStream(__dirname  + requestUrl.pathname);
    stream.on('error', function(err) {
        console.log(err.message);
        response.end(err.message);
    });
    stream.on('open', function() {
        stream.pipe(response);
    });

}).listen(420);
