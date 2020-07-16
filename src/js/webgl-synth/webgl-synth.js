let { AudioCanvas } = require('./dsp/AudioCanvas');
let DSPParam = require('./ui/DSPParam');
let DSPKnob = require('./ui/DSPKnob');



// launch on interaction
let AudioCtx = {};
AudioCtx.InitIfRequired = function() {
    if (AudioCtx.started) return;
    AudioCanvas.init();
    AudioCanvas.start();
    stuff();
    AudioCtx.DiscardEventListeners();
    AudioCtx.started = true;
}
AudioCtx.StartOnInteraction = function() {
    document.addEventListener('touchstart', AudioCtx.InitIfRequired);
    document.addEventListener('touchmove' , AudioCtx.InitIfRequired);
    document.addEventListener('touchend'  , AudioCtx.InitIfRequired);
    document.addEventListener('keypress'  , AudioCtx.InitIfRequired);
    document.addEventListener('mouseup'   , AudioCtx.InitIfRequired);
};
AudioCtx.DiscardEventListeners = function() {
    document.removeEventListener('touchstart', AudioCtx.InitIfRequired);
    document.removeEventListener('touchmove' , AudioCtx.InitIfRequired);
    document.removeEventListener('touchend'  , AudioCtx.InitIfRequired);
    document.removeEventListener('keypress'  , AudioCtx.InitIfRequired);
    document.removeEventListener('mouseup'   , AudioCtx.InitIfRequired);
};
AudioCtx.StartOnInteraction();
//



function stuff() {
    const KEYMAP = {
        // Top
        // 0
        81 : 0 , // C  Q
        50 : 1 , // C# 2
        87 : 2 , // D  W
        51 : 3 , // D# 3
        69 : 4 , // E  E
        82 : 5 , // F  R
        53 : 6 , // F# 5
        84 : 7 , // G  T
        54 : 8 , // G# 6
        89 : 9 , // A  Y
        55 : 10, // A# 7
        85 : 11, // B  U
        // 1
        73 : 12, // C  I
        57 : 13, // C# 9
        79 : 14, // D  O
        48 : 15, // D# 0
        80 : 16, // E  P

        // Bottom
        // 0
        90 : 12, // C  Z
        83 : 13, // C# S
        88 : 14, // D  X
        68 : 15, // D# D
        67 : 16, // E  C
        86 : 17, // F  V
        71 : 18, // F# G
        66 : 19, // G  B
        72 : 20, // G# H
        78 : 21, // A  N
        74 : 22, // A# J
        77 : 23, // B  M

        // 1
        188: 24, // C  ,
        76 : 25, // C# L
        190: 26  // D  .
    };
    const INTERVAL = 1.05946309436;
    const BASE_FREQ = 432 / 4;
    window.freq = 250;

    /*******************************************************************************
     *
     * Keyboard input mapping.
     *
     ******************************************************************************/
    document.addEventListener('keydown', function(e) {
        if (KEYMAP[e.keyCode] == null) return;

        // Trigger VCO if it wasn't held already
        let key = document.querySelectorAll('.key')[KEYMAP[e.keyCode]];
        if (!key.classList.contains('held')) {
            window.freq = BASE_FREQ * Math.pow(INTERVAL, KEYMAP[e.keyCode]);
            window.primaryVco.trigger();
        }

        // Trigger animation
        key.classList.add('held');
    });
    document.addEventListener('keyup', function(e) {
        if (KEYMAP[e.keyCode] == null) return;

        // Turn animation off
        let key = document.querySelectorAll('.key')[KEYMAP[e.keyCode]];
        key.classList.remove('held');
    });


    /*******************************************************************************
     *
     * Clickable piano keys.
     *
     ******************************************************************************/
    let keys = document.querySelectorAll('.key');
    Array.prototype.forEach.call(keys, function(key, i) {
        key.addEventListener('mousedown', function(event) {
            window.freq = BASE_FREQ * Math.pow(INTERVAL, i);
            window.primaryVco.trigger();
        });
    });


    /*******************************************************************************
     *
     * Knobs & sliders.
     *
     ******************************************************************************/
    new DSPParam('vcoAttack', window.primaryVco, 'Attack');
    new DSPParam('vcoDecay', window.primaryVco, 'Decay');
    new DSPParam('vcoSustain', window.primaryVco, 'Sustain');
    new DSPParam('vcoRelease', window.primaryVco, 'Release');


    // @FIXME: tijdelijk
    window.primaryVco.uniforms.Attack = 3 - window.primaryVco.uniforms.Attack;
    window.primaryVco.uniforms.Decay = 3 - window.primaryVco.uniforms.Decay;
    // window.primaryVco.uniforms.Sustain = 3 - window.primaryVco.uniforms.Sustain;
    window.primaryVco.uniforms.Release = 3 - window.primaryVco.uniforms.Release;



    // new DSPParam('vcoCutoff', window.primaryVco, 'FilterCutoff');



    /*******************************************************************************
     *
     * Make sure the keyboard fits on the screen.
     * If not, hide the keys of the last octave.
     *
     ******************************************************************************/
    window.addEventListener('resize', (event) => {
        let octaves = document.querySelectorAll('.keyboard__octave');

        if (this.innerWidth < 728) {
            octaves[octaves.length - 1].classList.add('hide');
            if (this.innerWidth < 650) {
                // console.log(octaves, octaves.length - 2);
                octaves[octaves.length - 2].classList.add('hide');
            }
        } else {
            octaves[octaves.length - 1].classList.remove('hide');
            octaves[octaves.length - 2].classList.remove('hide');
        }
    });
}
