function groet(country = 'nl') {
    const text = {
        'nl': {
            'night': 'Welkom nachtuil',
            'morning': 'Goedenmorgen',
            'afternoon': 'Goedemiddag',
            'evening': 'Goedenavond'
        },
        'en': {
            'night': 'Welcome nightowl',
            'morning': 'Good morning',
            'afternoon': 'Great afternoon',
            'evening': 'Good evening'
        }
    }

    let a = '';
    let hours = new Date().getHours();
    if (hours < 6) a = text[country]['night'];
    else if (hours < 12) a = text[country]['morning'];
    else if (hours < 18) a = text[country]['afternoon'];
    else a = text[country]['evening'];
    return a;
}

function leeftijd() {
    var birthday = +new Date('1999-05-20');
    return~~ ((Date.now() - birthday) / (31557600000));
}

function dia(country = 'nl') {
    const t = {
        'nl': {
            'day': 'dag',
            'night': 'nacht'
        },
        'en': {
            'day': 'day',
            'night': 'night'
        }
    };
    if (new Date().getHours() < 12) return t[country]['night'];
    else return t[country]['day'];
}



/*******************************************************************************
 *
 ******************************************************************************/



LocaleManager = function() {
    let _sections = document.querySelectorAll('.section');
    if (!_sections) return;
    _sections.forEach(_section => {
        switch (_section.id) {
        case 'section-about':
            let _spans = _section.querySelectorAll('span');
            _spans.forEach(_span => {
                if (_span.classList.contains('nl')) {
                    _span.innerHTML = _span.innerHTML.replace('$groet', groet());
                    _span.innerHTML = _span.innerHTML.replace('$leeftijd', leeftijd());
                    _span.innerHTML = _span.innerHTML.replace('$dia', dia());
                } else {
                    _span.innerHTML = _span.innerHTML.replace('$groet', groet('en'));
                    _span.innerHTML = _span.innerHTML.replace('$leeftijd', leeftijd());
                    _span.innerHTML = _span.innerHTML.replace('$dia', dia('en'));
                }
            });
            break;
        case 'section-projects':
            break;
        case 'section-contact':
            break;
        }
    });
    
}

LocaleManager.prototype.change = function(country) {
    const countries = [ 'nl', 'en' ];
    countries.forEach(c => document.body.classList.remove(c));
    document.body.classList.add(country);
}

module.exports = LocaleManager;

//
//
// new Locale({
//     '$groet': function() {
//
//     },
//
//     '$leeftijd': function() {
//         return 21;
//     }
//
//     '$dia': function() {
//         return 'dag';
//     }
//
// });
