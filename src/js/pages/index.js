/***
 *
 * Apply locale
 *
 */
let LocaleManager = require('LocaleManager.js');
g_locale = new LocaleManager();


/***
 *
 * Play music
 *
 */
let songname = [ 'audio/polegnala_single_loop.ogg', 'audio/rain_1.ogg' ][Math.floor(Math.random() * 2)];
let Muziekje = require('Muziekje.js');
new Muziekje(songname).play();
Muziekje.StartOnInteraction();


/***
 *
 * Navigation
 *
 **/
let navbtns = [ 'about', 'projects', 'contact', 'welcome' ];
navbtns.forEach(n => {
    let _e = document.getElementById(n);
    if (!_e) return;
    _e.addEventListener('click', event => {

        // deactivate currently displayed section
        document.querySelector('.section.active').classList.remove('active');

        // activate corresponding section
        document.getElementById('section-' + event.target.parentElement.id).classList.add('active');

        // give section wrapper an indication of currently active section
        document.querySelector('.section-wrapper').id = 'section-wrapper-' + event.target.parentElement.id;

    })
});
