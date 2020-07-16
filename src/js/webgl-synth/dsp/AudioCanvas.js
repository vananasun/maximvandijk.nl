/**
 * DSP engine's main class.
 */
var AudioCanvas = {

    /**
     * Default engine settings.
     * @var {Object} settings
     * @property {string} texWidth  - GPU buffer texture width.
     * @property {string} texHeight - GPU buffer texture height.
     * @property {number} frequency - Processing rate in ms.
     * @property {number} latency   - Delay period in s.
     */
    settings: {
        texWidth : 32, // 64
        texHeight: 32, // 64
        frequency: 1000 / 120,
        latency: 60 / 1000//45 / 1000
    },

    /**
     * Engine states.
     * @var {Array}  buffers    - Cache of buffers that are being or about to be processed.
     * @var {Number} bufferTime - Current furthest computed time we were able to bufferize.
     * @var {Number} audioTime  - Absolute Web Audio API time which corresponds to the bufferTime.
     */
    buffers: [],
    bufferTime: 0.0,
    audioTime: 0.0,


    /**
     * RUNNNNNNNN!
     * @param {Object} options - Overwritten engine settings.
     */
    init: function(options = null) {
        // Merge settings
        let self = AudioCanvas;
        self.settings = Object.assign({}, self.settings, options);

        /**
         * Create a Web Audio API context and connect a gain node to act as a master volume control.
         * @var {AudioContext} audioContext
         * @var {AudioNode}    destination - Master gain.
         */
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        self.audioContext = new AudioContext();

        self.destination = self.audioContext.createGain();
        self.destination.gain.value = 1.0 / 255.0; // @TODO: Correct this maybe to 1.0 / 255.0.
        self.destination.connect(self.audioContext.destination);

        // self.filterNode = self.audioContext.createBiquadFilter
        // quadFilterFrequencySlider.oninput = function(evt){
        //     filterNode.frequency.value = parseFloat(evt.target.value);
        // };
        //
        // biquadFilterDetuneSlider.oninput = function(evt){
        //     filterNode.detune.value = parseFloat(evt.target.value);
        // };
        //
        // biquadFilterQSlider.oninput = function(evt){
        //     filterNode.Q.value = parseFloat(evt.target.value);
        // };
        //
        //
        // biquadFilterTypeSelector.onchange = function(evt){
        //     filterNode.type = evt.target.value;

        /**
         * Create a WebGL canvas.
         * @var      {Object}                webGLCanvas
         * @property {HTMLCanvasElement}     webGLCanvas.canvas
         * @property {WebGLRenderingContext} webGLCanvas.gl
         */
        self.webGLCanvas = createWebGLCanvas(self.settings.texWidth, self.settings.texHeight);

        // Create master mixer
        self.masterMixer = new Mixer();
    },



    /**
     * Render signal from DSP tree and schedule next chunk.
     * @method
     */
    process: function() {
        // @TODO: document
        let self = AudioCanvas;
        let bufferSource = self.audioContext.createBufferSource();
        bufferSource.connect(self.destination);

        let pixelBuffer = self.masterMixer.process();
        let audioBuffer = self.audioContext.createBuffer(2, pixelBuffer.length, self.audioContext.sampleRate);
        audioBuffer.getChannelData(0).set(pixelBuffer);
        audioBuffer.getChannelData(1).set(pixelBuffer);

        bufferSource.buffer = audioBuffer;
        bufferSource.start(self.audioTime);

        let item = {
            data: pixelBuffer,
            width: self.settings.texWidth,
            height: self.settings.texHeight,
            bufferTime: self.bufferTime,
            destroy: function () {
                bufferSource.disconnect(AudioCanvas.destination);
            }
        };
        self.buffers.push(item);

        self.bufferTime += pixelBuffer.length;
        self.audioTime  += audioBuffer.duration;

    },


    /**
     * Call processing function and schedule next call.
     * @method
     */
    start: function() {
        // Clean outdated buffers
        let self = AudioCanvas;
        self.buffers = _.filter(self.buffers, function(buffer) {
            if (buffer.bufferTime + buffer.data.length < Math.floor(self.audioContext.currentTime * self.audioContext.sampleRate)) {
                buffer.destroy();
                return false;
            }
            return true;
        });

        // Process if needed
        if (self.audioContext.currentTime + self.settings.latency > self.audioTime) {
            self.process();
        }

        // @TODO: Re-align time to Web Audio API's time.
        // self.audioTime = self.audioContext.currentTime;
        // self.bufferTime = Math.floor(self.audioTime * self.audioContext.sampleRate);

        // Schedule
        setTimeout(self.start, self.settings.frequency);
    }

};

module.exports = { AudioCanvas: AudioCanvas };
var _ = require("lodash");
var { Mixer } = require('./Mixer');
var createWebGLCanvas = require('./createWebGLCanvas');