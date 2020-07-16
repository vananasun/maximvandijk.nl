let express = require('express');
let request = require('request');
let path = require('path');



let app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

// serve static resources
app.use(express.static(path.join(__dirname, 'public')));


// templates
app.get('/simply-sanskrit', (req, res) => {
    app.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.render('pages/simply-sanskrit');
});
app.get('/air-rpg/', (req, res) => {
    app.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.render('pages/air-rpg');
});
app.get('/vvrc7/', (req, res) => {
    app.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.render('pages/vvrc7');
});
app.get('/floaty-shaper/', (req, res) => {
    app.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.render('pages/floaty-shaper');
});
app.get('/webgl-synth/', (req, res) => {
    app.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.render('pages/webgl-synth');
});
app.get('/', (req, res) => {
    res.render('pages/index');
});


// proxy for simplySanskrit words
app.get('/word/:word', (req, res) => {
    let word = req.params.word;
    request('https://sanskritdictionary.org/' + word, (error, response, body) => {
        if (!response || (200 !== response.statusCode)) {
            console.error('simplySanskrit proxy error:', error);
            return;
        }
        res.send(body);
        res.end();
    });
});

app.listen(80);
