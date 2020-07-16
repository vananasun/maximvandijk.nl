var { AudioCanvas } = require('./AudioCanvas');
var DSP = require('./DSP');

/**
 * @class VCO
 * @extends {DSP}
 * @constructor
 */
VCO = function() {
    DSP.call(this);
    this.uniforms['Start']   = -666.0;
    this.uniforms['Attack']  = 0.0211267605633803;
    this.uniforms['Decay']   = 0.0264084507042254;
    this.uniforms['Sustain'] = 0.0475352112676056;
    this.uniforms['Release'] = 2.69366197183099;
};
VCO.prototype = Object.create(DSP.prototype);


VCO.prototype.FRAG_SHADER = `
    uniform float Start;
    uniform float Attack;
    uniform float Decay;
    uniform float Sustain;
    uniform float Release;
    
    uniform float FilterCutoff;
    

    // Implementation of an ADSR envelope. Fundamental of electronic music.
    // See http://en.wikipedia.org/wiki/ADSR_envelope#ADSR_envelope
    /*
      adsr parameters:
    
     - tabs: the absolute current time
     - env: the envelope: vec4(attack, decay, sustain, release)
     - start: the time position where you want to make the envelope start
     - duration: the duration of the note (the duration your finger is pressed on the note)
    */
    float adsr(float tabs, vec4 env, float start, float duration) {
        float t = tabs - start;
        float sustain = env[2];
        float t1 = env[0];
        float t2 = t1 + env[1];
        float t3 = max(t2, duration);
        float t4 = t3 + env[3];
        if (t < 0.0 || t > t4) {
            return 0.0;
        }
        else if(t <= t1) {
            return smoothstep(0.0, t1, t);
        } else if(t <= t2) {
            float f = smoothstep(t2, t1, t);
            return sustain + f * (1.0 - sustain);
        } else if(t <= t3) {
            return sustain;
        } else {
            return sustain * smoothstep(t4, t3, t);
        }
    }


    float PI = acos(-1.);
    float dsp(float i, float t, int o) {
        float frequency = Freq + ((sin(2.0 * PI * t * 2.0) * 0.002) );
        float env = adsr(t, vec4(Attack, Decay, Sustain, Release), Start, 0.6);
        float osc = sin(2. * PI * t * frequency);
        
        
        // low pass filter
        // Coefficient computation
        // Cutoff and reso are [0,128) integers
        // c = 0.5^[(128-Cutoff) / 16.0]
        // r = 0.5^[( 24+Reso)   / 16.0]
        //
        // v0 = (1.0 - r*c)*v0 - c*v1 + c*input
        // v1 = (1.0 - r*c)*v1 + c*v0
        
        // // Coefficient computation
        // // Cutoff and reso are [0,128) integers
        // c = 0.5^[(128-Cutoff) / 16.0]
        // r = 0.5^[( 24+Reso)   / 16.0]
        //
        // v0 = (1.0 - r*c)*v0 - c*v1 + c*input
        // v1 = (1.0 - r*c)*v1 + c*v0
        
        
        return 0.3 * osc * env;
     
    }
`;





/**
 * Trigger note.
 */
VCO.prototype.trigger = function() {
    this.uniforms['Start'] = AudioCanvas.bufferTime / AudioCanvas.audioContext.sampleRate;
    // this.uniforms['Duration'] = .6;
};


module.exports = VCO;