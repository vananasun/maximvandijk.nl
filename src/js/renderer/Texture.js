let ShaderProgram = require("renderer/ShaderProgram.js");

/**
 * @constructor
 *
 * @param {string} url (optional)
 */
function Texture(url = null) {
    if (!url) return;
    this.loaded = false;

    // Create texture
    this.id = gl.createTexture();

    // Load image
    let self = this;
    this.image = new Image();
    this.image.src = url;
    this.image.addEventListener('load', function() {
        gl.bindTexture(gl.TEXTURE_2D, self.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        self.width = self.image.width;
        self.height = self.image.height;
        self.image = null;
        self.loaded = true;
    }, false);
}

Texture.prototype.getAspect = function() {
    if (!this.loaded) return 1.0;
    return this.width / this.height;
}

// Texture.prototype.makeRenderable = function(shader) {
//
//     let vertices = [
//         0.0, 0.0,
//         1.0, 0.0,
//         1.0, 1.0,
//         0.0, 0.0,
//         1.0, 1.0,
//         0.0, 1.0
//     ];
//
//     this.uvBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//     for (let i = 0; i < vertices.length; i++) vertices[i] *= 200.0;
//
//     this.vertexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//     let oldShader = shader.use();
//     this.locVertices = shader.locateAttrib("aVertices");
//     this.locUVs = shader.locateAttrib("aUVs");
//     this.locSampler = shader.locateUniform("uSampler");
//     if (oldShader) oldShader.use();
//     this.shader = shader;
// }
//
// Texture.prototype.render = function() {
//     if (!this.loaded) return;
//     let oldShader = this.shader.use();
//
//     // Bind vertices
//     gl.enableVertexAttribArray(this.locVertices);
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
//     gl.vertexAttribPointer(this.locVertices, 2, gl.FLOAT, false, 0, 0);
//
//     // Bind tex coords
//     gl.enableVertexAttribArray(this.locUVs);
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
//     gl.vertexAttribPointer(this.locUVs, 2, gl.FLOAT, false, 0, 0);
//
//     // Bind texture to sampler
//     this.shader.bindSampler(this.locSampler, this.texture);
//
//     // Draw!
//     gl.drawArrays(gl.TRIANGLES, 0, 6);
//     if (oldShader) oldShader.use();
//
// }

module.exports = Texture;
