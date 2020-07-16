let SoundBuffer = require('SoundBuffer.js');

function Muziekje(url) {
    let promise = Muziekje.RequestContext();
    this.soundBuffer = new SoundBuffer(url, promise);
}

Muziekje.loaded = false;
Muziekje.ctx = null;
Muziekje.gainNode = null;

/**
 * Wait for a user interaction and then start the audio context.
 */
Muziekje.StartOnInteraction = function() {
    document.addEventListener('touchstart', Muziekje.InitIfRequired);
    document.addEventListener('touchmove' , Muziekje.InitIfRequired);
    document.addEventListener('touchend'  , Muziekje.InitIfRequired);
    document.addEventListener('keypress'  , Muziekje.InitIfRequired);
    document.addEventListener('mousewheel', Muziekje.InitIfRequired);
    document.addEventListener('mouseup'   , Muziekje.InitIfRequired);
}

Muziekje.DiscardEventListeners = function() {
    document.removeEventListener('touchstart', Muziekje.InitIfRequired);
    document.removeEventListener('touchmove' , Muziekje.InitIfRequired);
    document.removeEventListener('touchend'  , Muziekje.InitIfRequired);
    document.removeEventListener('keypress'  , Muziekje.InitIfRequired);
    document.removeEventListener('mousewheel', Muziekje.InitIfRequired);
    document.removeEventListener('mouseup'   , Muziekje.InitIfRequired);
}



/**
 * Initialize the audio context.
 */
Muziekje.InitIfRequired = function() {
    if (Muziekje.loaded) return;

    // Create context
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    Muziekje.ctx = new AudioContext();

    // Setup nodes
    Muziekje.targetVolume = 0.06;
    Muziekje.gainNode = Muziekje.ctx.createGain();
    Muziekje.gainNode.gain.value = 0.0;
    Muziekje.gainNode.connect(Muziekje.ctx.destination);

    Muziekje.loaded = true;
    Muziekje.DiscardEventListeners();
}

/**
 * @return {Promise}
 */
Muziekje.RequestContext = function() {
    return new Promise(
        function(resolve, reject) {
            (function waitForContext() {
                if (null !== Muziekje.ctx) return resolve(Muziekje.ctx);
                setTimeout(waitForContext, 30);
            })();
        }
    );
}

/**
 * Request to play sound
 */
Muziekje.prototype.play = function() {
    this.soundBuffer.requestBuffer().then(function(){

        let source = Muziekje.ctx.createBufferSource();
        source.loop = true;
        source.buffer = this.soundBuffer.buffer;
        source.connect(Muziekje.gainNode);
        source.start(Muziekje.ctx.currentTime);
        Muziekje.gainNode.gain.linearRampToValueAtTime(Muziekje.targetVolume, 8);

    }.bind(this));
}



module.exports = Muziekje;
