var { AudioCanvas } = require('./AudioCanvas');

function Signal() {
    return new Uint8Array(
        AudioCanvas.settings.texWidth * AudioCanvas.settings.texHeight * 4
    );
}

module.exports = Signal;