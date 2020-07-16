var assert = require('../util/assert');
var { AudioCanvas } = require('./AudioCanvas');
var Signal = require('./Signal.js');
var DSP = require('./DSP.js');

/**
 * @param {Chain|null} parent
 * @constructor
 */
function Chain(parent = null) {
    this.parent = parent;
    this.children = [];
    this.dsps = [];
}

/**
 * @param {Chain} chain
 */
Chain.prototype.insert = function(chain) {
    assert(chain,'Expected object of type Chain');
    this.children.push(chain);
    console.log('Chain added');
};

/**
 * Search for and remove the given chain.
 *
 * @param {Chain} chain - Reference to chain object.
 *
 * @returns {Boolean} found
 */
Chain.prototype.remove = function(chain) {
    assert(chain,'Expected object of type Chain');

    // This is the chain, we found it
    if (chain === this) {
        console.log('Chain successfully removed!!!!');
        return true;
    }

    // Let's search for the chain inside our children
    let found = false;
    this.children.forEach(function(child, index, children){
        if (!child.remove(chain)) return;
        children.splice(index, 1);
        found = true;
    });
    return found;
};


/**
 * Add processor to chain.
 * @param {DSP} dsp
 */
Chain.prototype.addDSP = function(dsp) {
    assert(dsp,'Expected object of type DSP');
    this.dsps.push(dsp);
};

/**
 * Run da DSPs.
 * @returns {Signal}
 */
Chain.prototype.process = function() {
    let signal = Signal();

    // Process child chains
    let self = this;
    this.children.forEach(function(chain) {
        signal = chain.process();
    });

    // Process our own DSPs
    this.dsps.forEach(function(dsp) {
        dsp.setFreq(window.freq);
        signal = dsp.process(signal);
    });

    return signal;
};

module.exports = Chain;