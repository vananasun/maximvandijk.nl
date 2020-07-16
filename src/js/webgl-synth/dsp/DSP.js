var createShader = require("gl-shader");
var Signal = require('./Signal.js');
var assert = require('../util/assert');
var glslAudioWrapper = require("./glslAudioWrapper");
var { AudioCanvas } = require('./AudioCanvas');


// Basic square vertex (2 triangles)
var VERT_SHADER = `
    precision highp int;
    precision highp float;
    attribute vec2 position;
    void main() { gl_Position = vec4(2.0*position-1.0, 0.0, 1.0); }`;



/**
 * @constructor
 */
function DSP() {
    this.uniforms = {};
}

// Passthrough DSP function
DSP.prototype.FRAG_SHADER = `
    float dsp(float i, float t, int index) {
        return i;
    }`;

/**
 * @destructor
 */
DSP.destroy = function() {
    this.shader.dispose();
    AudioCanvas.webGLCanvas.gl.deleteTexture(this.texInput);
};




/**
 * @param {Integer} freq
 */
DSP.prototype.setFreq = function(f) {
    //@FIXME
    this.freq = f;
    this.uniforms['Freq'] = this.freq;
};

/**
 * @param {String|null} dspCode - GLSL DSP function code.
 */
DSP.prototype.loadShader = function(dspCode = null) {
    let w = AudioCanvas.webGLCanvas.canvas.width,
        h = AudioCanvas.webGLCanvas.canvas.height,
        gl = AudioCanvas.webGLCanvas.gl;

    // Default to passthrough shader if necessary.
    dspCode = dspCode || this.FRAG_SHADER;

    // Create and bind the shader
    this.shader = createShader(gl, VERT_SHADER, glslAudioWrapper(dspCode));
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    this.shader.attributes.position.pointer();
    this.shader.bind();

    // Create input texture
    this.texInput = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texInput);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // Sync the viewport size
    gl.viewport(0, 0, w, h);
    this.shader.uniforms.Resolution = new Float32Array([ w, h ]);
    this.shader.uniforms.SampleRate = AudioCanvas.audioContext.sampleRate;
    this.shader.uniforms.InpTex = 0;//this.texInput;
    var x1 = 0, x2 = w, y1 = 0, y2 = h;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);

};

/**
 * @param {Signal} input
 */
DSP.prototype.process = function(input) {
    return this.generate(AudioCanvas.bufferTime, 0, input);
};


/**
 * Returns the pixel buffer of the canvas from a given bufferTime.
 */
DSP.prototype.generate = function(bufferTime, channel, optionalBuffer) {
    // Bind shader with uniforms
    this.shader.bind();
    this.shader.uniforms.BufferTime = bufferTime / AudioCanvas.audioContext.sampleRate;
    this.shader.uniforms.Channel = channel;
    Object.keys(this.uniforms).forEach(function(key) {
        this.shader.uniforms[key] = this.uniforms[key];
    }, this);

    // Create or use buffer (currently transferred from RAM to GPU cache).
    let w = AudioCanvas.webGLCanvas.canvas.width,
        h = AudioCanvas.webGLCanvas.canvas.height,
        gl = AudioCanvas.webGLCanvas.gl;
    let buffer = optionalBuffer || new Uint8Array(w * h * 4);
    // for(let i =0; i < buffer.length;i++){
    //    buffer[i] += Math.floor(Math.rand
    // }

    // Compute!
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texInput);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    return buffer;
};


/**
 * Set a parameter that'll be used by the DSP function.
 *
 * @param {string} name
 * @param {string} value
 */
DSP.prototype.setParam = function(name, value) {
    this.uniforms[name] = value;
};


module.exports = DSP;
