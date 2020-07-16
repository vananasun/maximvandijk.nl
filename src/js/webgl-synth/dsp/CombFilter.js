var { AudioCanvas } = require('./AudioCanvas');
var DSP = require('./DSP');


/**
 * @class CombFilter
 * @extends {DSP}
 * @constructor
 */
CombFilter = function(texSize, delayInSamples, masterVolume, delayVolume) {
    DSP.call(this);

    this.uniforms.TexDelaySize       = new Float32Array([texSize, texSize]);
    this.uniforms.DelayInSamples     = delayInSamples;
    this.uniforms.MasterVolume       = masterVolume; // @FIXME: Unused
    this.uniforms.DelayVolume        = delayVolume;

    // Create delay buffer and it's texture
    this.uniforms.DelayInputPointer  = delayInSamples;
    this.uniforms.DelayOutputPointer = 0;
    this.delayBuffer = new Uint8Array(texSize * texSize * 4);
    for (let i = 0; i < this.delayBuffer.length; i++) {
        this.delayBuffer[i] = 127;
    }

    let gl = AudioCanvas.webGLCanvas.gl;
    this.texDelay = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texDelay);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.uniforms.TexDelaySize[0], this.uniforms.TexDelaySize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, this.delayBuffer);


};
CombFilter.prototype = Object.create(DSP.prototype);


CombFilter.prototype.process = function(input) {
    let gl = AudioCanvas.webGLCanvas.gl;

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texDelay);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.uniforms.TexDelaySize[0], this.uniforms.TexDelaySize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, this.delayBuffer);
    this.uniforms.TexDelay = 1;
    let sig = this.generate(AudioCanvas.bufferTime, 0, input);

    // @TODO: Optimize this, by for example, moving the increments
    //        of the DelayOutputPointer outside of the loop.
    for (let i = 0; i < sig.length; i++) {
        this.delayBuffer[this.uniforms.DelayInputPointer] = sig[i];

        // Manage circulair delay buffer pointers.
        this.uniforms.DelayInputPointer++;
        if (this.uniforms.DelayInputPointer >= this.delayBuffer.length-1)
            this.uniforms.DelayInputPointer = 0;

        this.uniforms.DelayOutputPointer++;
        if (this.uniforms.DelayOutputPointer >= this.delayBuffer.length-1)
            this.uniforms.DelayOutputPointer = 0;

    }

    return sig;
};


CombFilter.prototype.FRAG_SHADER = `
    uniform sampler2D TexDelay;
    uniform vec2 TexDelaySize;
    uniform float DelayVolume;
    uniform int DelayOutputPointer;

    
    /**
     * Convert value from range [-1, 1] to [0, 255] and round it downwards.
     *
     * @param float x
     *
     * @returns int 
     */
    int _F2B(float x) {
        return int((x + 1.) * 127.5);
    }
    

    float dsp(float sampleInput, float t, int o) {
        // Get delay buffer sample and normalize it from [ 0, 1 ] to [ -1, 1 ].
        int offset = _GetOffset() + DelayOutputPointer + o;
        float sampleDelay = (readBuffer(TexDelay, TexDelaySize, offset) * 2.) - 1.;

        // Fix floating point rounding error in volume since we use 8-bit audio.
        // This essentially gates the signal so be careful not to distort it any further.
        float sampleProcessed = sampleDelay * DelayVolume;
        // if (_F2B(sampleDelay) == _F2B(sampleProcessed))
        //     sampleProcessed = 0.0;
        
        // float sampleOutput = sampleProcessed + sampleInput;
        // const float threshold = 1./127.5;
        // if (abs(sampleProcessed) * 0.5 <= threshold)
        //     if (abs(sampleOutput) * 0.0525 <= threshold)
        //         return 0.0;
        
        // Mix normal audio data with delayed audio.
        return sampleProcessed + sampleInput;
    }
`;

module.exports = CombFilter;