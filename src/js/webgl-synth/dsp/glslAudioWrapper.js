/**
 * Wrap the DSP function GLSL code with wrapper to properly encode the audio samples buffer.
 */
function glslAudioWrapper(dspCode) {
    return `
    #ifdef GL_ES\nprecision highp int;precision highp float;\n#endif
    
    uniform vec2 Resolution;
    uniform float BufferTime;
    uniform float SampleRate;
    uniform float Channel;
    uniform float Freq;
    uniform sampler2D InpTex;
    
    int uvToOffset(vec2 uv, vec2 res) {
        return int(res.x * uv.y + uv.x);
    }
    
    vec2 offsetToUV(float i, vec2 res) {
        float x = mod(i, res.x);
        float y = (i - x) / res.x;
        return vec2(x,y);
    }
    
    /**
     * @TODO: Make this a const or a dsp function parameter.
     */
    int _GetOffset() {
        return 4 * int(Resolution.x * (gl_FragCoord.t-.5) + (gl_FragCoord.s-.5));
    }
    
    
    /**
     * Read a float value at a certain position of a texture.
     *
     * @param sampler2D tex    - Texture to use as buffer.
     * @param vec2      size   - Width and height of the texture.
     * @param int       offset - Index of the value in the buffer, must be aligned to 4.
     *
     * @returns float
     */
    float readBuffer(sampler2D tex, vec2 size, int offset) {
        // Pick texel
        int offsetBase = offset / 4;
        int slot = offset - (offsetBase * 4);
        vec4 texel = texture2D(tex, offsetToUV(float(offsetBase), size) / size);
        
        // Pick appropriate value from texel vector.
        if (0 == slot) return texel.r;
        if (1 == slot) return texel.g;
        if (2 == slot) return texel.b;
        if (3 == slot) return texel.a;
        return texel.a;
    }
    
    ${dspCode}
    
    void main() {
    
        // Grab input signal and normalize it from [ 0, 1 ] to [ -1, 1 ].
        vec4 inpSig = (texture2D(InpTex, (gl_FragCoord.st - .5) / Resolution) * 2.) - 1.;
        
        // Calculate time of current frag coord.
        float t = BufferTime + 4. * (Resolution.x * (gl_FragCoord.y - .5) + (gl_FragCoord.x - .5)) / SampleRate;
        
        // Run the DSP function.
        vec4 outSig = vec4(
            dsp(inpSig.r, t               , 0),
            dsp(inpSig.g, t+1.0/SampleRate, 1),
            dsp(inpSig.b, t+2.0/SampleRate, 2),
            dsp(inpSig.a, t+3.0/SampleRate, 3)
        );
        
        // Normalize from [ -1, 1 ] to [ 0, 1 ] to get a color representation.
        gl_FragColor = (outSig + 1.) / 2.;
    
    }
    `;
};
module.exports = glslAudioWrapper;