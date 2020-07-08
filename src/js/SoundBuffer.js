
/**
 * @constructor
 */
function SoundBuffer(url, promise) {
    this.url = url;
    this.buffer = null;

    let self = this;
    let req = new XMLHttpRequest();
    req.open("GET", this.url, true);
    req.responseType = "arraybuffer";

    req.onload = promise.then(function(ctx) {
        self.decodeBuffer(req.response, ctx);
    });
    req.onerror = function(){ console.error('XHR error'); }
    req.send();
}

/**
 *
 */
SoundBuffer.prototype.decodeBuffer = function(response, ctx) {
    let self = this;
    if (!response) {
        console.error('Failed to request audio file "'+self.url+'"');
        return;
    }
    ctx.decodeAudioData(
        response,
        function(buffer) {
            if (!buffer) {
                console.error('Error decoding audio file "'+self.url+'"');
                return;
            }
            self.buffer = buffer;
        },
        function(error) {
            console.error('decodeAudioData error', error);
        }
    );

}

/**
 * Request a SoundBuffer's buffer of audio data.
 *
 * @return {Promise} Will be fulfilled once the SoundBuffer is loaded.
 */
SoundBuffer.prototype.requestBuffer = function() {
    let self = this;

    return new Promise(
        function(resolve, reject) {
            (function waitForSoundBufferToLoad() {
                if (null !== self.buffer) return resolve();
                // @TODO: Reject on timeout
                setTimeout(waitForSoundBufferToLoad, 30);
            })();
        }
    );
}



module.exports = SoundBuffer;
