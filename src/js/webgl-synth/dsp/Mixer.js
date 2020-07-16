var { AudioCanvas } = require('./AudioCanvas');
var Chain = require('./Chain');
var DSP = require('./DSP');
var VCO = require('./VCO');
var CombFilter = require('./CombFilter');

/**
 * A Mixer is a tree that holds all the chains and schedules it's output for
 * playback on the Web Audio API AudioContext.
 * @constructor
 */
function Mixer() {
    let vcoShader = 'float PI = acos(-1.0);\n' +
        'float dsp (float i, float t) {\n' +
        '  return i + (0.8 * sin(2.0 * PI * t * 432.0)); // The most fundamental sound: a sine wave at 440 Hz\n' +
        '}';




    // Create dummy DSP tree
    let root = new Chain();
    let c = new Chain(root);

    let vco = new VCO();
    vco.loadShader();
    c.addDSP(vco);
    window.primaryVco = vco;

    let delay = new CombFilter(32, Math.floor(30000/4)*4, 0.2, 0.8);
    delay.loadShader();
    c.addDSP(delay);

    root.insert(c);
    // c = new Chain(, root);
    // let ca = new Chain(, c);
    // ca.addDSP(new DSP());
    // ca.addDSP(new DSP());
    // ca.addDSP(new DSP());
    // c.insert(ca);
    // c.addDSP(new DSP());
    root.insert(c);
    this.chain = root;
    //

};



/**
 * Process entire DSP tree and schedule playback.
 *
 * @returns {Signal}
 */
Mixer.prototype.process = function() {
    let output = this.chain.process();

    // draw interference pattern
    var c = document.getElementById('audioBuffer');
    var ctx = c.getContext("2d");
    var iData = new ImageData(new Uint8ClampedArray(output), AudioCanvas.webGLCanvas.canvas.width, AudioCanvas.webGLCanvas.canvas.height);
    ctx.putImageData(iData, 0,0 );
    //------

    // console.log(output);
    return output;
};

module.exports.Mixer = Mixer;