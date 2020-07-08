/***
 *
 * Play music
 *
 */
let Muziekje = require('Muziekje.js');
new Muziekje('audio/polegnala_single_loop.ogg').play();
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

    })
});
