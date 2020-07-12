let express = require('express');
let request = require('request');
let path = require('path');



let app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

// serve static resources
app.use(express.static(path.join(__dirname, 'public')));
app.use('/simply-sanskrit', express.static(path.join(__dirname, 'public')));


// templates
app.get('/simply-sanskrit', (req, res) => {
    res.render('pages/simply-sanskrit');
});
app.get('/', (req, res) => {
    res.render('pages/index');
});


// proxy for simplySanskrit words
app.get('/word/*', (req, res) => {
    let word = req.path.substring(req.path.lastIndexOf('/') + 1);
    console.log(word)
    request('https://sanskritdictionary.org/' + word, (error, response, body) => {
        console.log(response.statusCode, body);
        if (200 !== response.statusCode) {
            console.error('simplySanskrit proxy error:', error);
            return;
        }
        res.send(body);
        res.end();
    });
});

app.listen(80);
