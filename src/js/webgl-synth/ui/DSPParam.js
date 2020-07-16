var DSP = require('../dsp/DSP'); // @FIXME: Remove?>????>>>>
var DSPKnob = require('./DSPKnob');

/**
 * Bind an input element to a DSP parameter.
 *
 * @param {string} id    - A DOM element's ID.
 * @param {DSP}    dsp   - DSP object.
 * @param {string} param - Parameter name.
 * @constructor
 */
DSPParam = function(id, dsp, param) {
    // this.element = (element instanceof Element) ? element : document.getElementById(element);
    // if (!this.element) throw new Error('Invalid element ' + element + ' given.');
    this.element = document.getElementById(id);


    this.param = param;
    this.dsp = dsp;
    dsp.setParam(param, this.element.value);


    // Check type of input (range slider, knob)
    let self = this;
    if (this.element.parentNode.classList.contains('AudioCanvas__param')) { // knob
        new DSPKnob(id, function(val) {
            // console.log(val);
            self.dsp.setParam(self.param, val);
        });
    } else { // range slider
        let self = this;
        this.element.oninput = function () {
            self.dsp.setParam(self.param, this.value);
        };
    }
};

module.exports = DSPParam;
