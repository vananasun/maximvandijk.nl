let express = require('express');
var path = require('path');


let app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('pages/index');
});


app.listen(80);
