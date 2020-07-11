let express = require('express');
let request = require('request');
let path = require('path');



let app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static('public'));


app.get('/simply-sanskrit', (req, res) => {
    res.render('pages/simply-sanskrit');
});
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Proxy for simplySanskrit words
app.get('/word/*', (req, res) => {
    let word = req.path.substring(req.path.lastIndexOf('/') + 1);
    request('https://sanskritdictionary.org/' + word, (error, response, body) => {
        if (200 !== response.statusCode) {
            console.error('simplySanskrit proxy error:', error);
            return;
        }
        res.send(body);
        res.end();
    });
});

app.listen(80);
