let ShaderProgram = require("renderer/ShaderProgram.js");

/**
 * @constructor
 */
function Texture() {
    this.loaded = false;
    this.id = gl.createTexture();
}

Texture.prototype.uploadImage = function(image) {
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.width = image.width;
    this.height = image.height;
    this.loaded = true;
}

Texture.prototype.getAspect = function() {
    if (!this.loaded) return 1.0;
    return this.width / this.height;
}

module.exports = Texture;
