let ShaderProgram = require("renderer/ShaderProgram.js");

// function generateUVs(divisions = 50) {
//     let uvs = new Float32Array(12 * divisions * divisions);
//     let index = 0;
//     for (let i = 0; i < divisions; i++) {
//         uvs[index++] = 0.0;
//         uvs[index++] = 0.0;
//         uvs[index++] = 1.0;
//         uvs[index++] = 0.0;
//         uvs[index++] = 1.0;
//         uvs[index++] = 1.0;
//
//         uvs[index++] = 0.0;
//         uvs[index++] = 0.0;
//         uvs[index++] = 1.0;
//         uvs[index++] = 1.0;
//         uvs[index++] = 0.0;
//         uvs[index++] = 1.0;
//     }
//     return uvs;
// }

/**
 * For a rectangle inside a screen, get the scale factor that permits the
 * rectangle to be scaled without stretching or squashing.
 *
 * @param {object} screen { {number} w, {number} h }
 * @param {object} img    { {number} w, {number} h }
 *
 * @return {object} rect { {number} x, {number} y, {number} w, {number} h }
 */
function fitRectInScreen(screen, img) {

    let imgRatio = img.h / img.w;
    let screenRatio = screen.h / screen.w;

    let final = {};
    if (screenRatio > imgRatio) {
        final.h = screen.h;
        final.w = Math.floor(img.w * (final.h / img.h));
    } else {
        final.w = screen.w;
        final.h = Math.floor(img.h * (final.w / img.w));
    }

    return {
        x: (screen.w - final.w) / 2,
        y: (screen.h - final.h) / 2,
        w: final.w,
        h: final.h
    };

}






function Grid(shader) {
    // generate buffers
    let vertices = this.generateVertices(1);
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // prepare for using the given shader
    let oldShader = shader.use();
    this.locVertices   = shader.locateAttrib("aVertices");
    this.locUVs        = shader.locateAttrib("aUVs");
    this.locSampler    = shader.locateUniform("uSampler");
    this.locPos        = shader.locateUniform("uPos");
    this.locSize       = shader.locateUniform("uSize");
    this.locTime       = shader.locateUniform("uTime");
    if (oldShader) oldShader.use();
    this.shader = shader;

}

/**
 * Generate a field of vertices.
 */
Grid.prototype.generateVertices = function(divisions = 50) {
    let vertices = new Float32Array(12 * divisions * divisions);
    let step = 1.0 / divisions;
    let index = 0;

    for (let x = 0.0; x < 1.0; x += step) {
        for (let y = 0.0; y < 1.0; y += step) {

            vertices[index++] = x;
            vertices[index++] = y;
            vertices[index++] = x + step;
            vertices[index++] = y;
            vertices[index++] = x + step;
            vertices[index++] = y + step;

            vertices[index++] = x;
            vertices[index++] = y;
            vertices[index++] = x + step;
            vertices[index++] = y + step;
            vertices[index++] = x;
            vertices[index++] = y + step;

        }
    }

    // calculate amount of vertices
    this.vertexCount = divisions * divisions * 6;

    return vertices;
}

Grid.prototype.bindTexture = function(texture) {
    this.texture = texture;
}

Grid.prototype.render = function(time) {
    if (!this.texture.loaded) return false;
    let oldShader = this.shader.use();

    // bind vertices
    gl.enableVertexAttribArray(this.locVertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.locVertices, 2, gl.FLOAT, false, 0, 0);

    // bind uvs
    gl.enableVertexAttribArray(this.locUVs);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(this.locUVs, 2, gl.FLOAT, false, 0, 0);

    // bind other uniforms
    let rect = fitRectInScreen(
        { w: gl.drawingBufferWidth, h: gl.drawingBufferHeight },
        { w: this.texture.width   , h: this.texture.height
    });
    this.shader.bind1f(this.locTime, time);
    this.shader.bind2f(this.locPos , rect.x, rect.y);
    this.shader.bind2f(this.locSize, rect.w, rect.h);

    // bind texture and draw
    this.shader.bindSampler(this.locSampler, this.texture.id);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    // if (oldShader) oldShader.use();
    return true;
}



module.exports = Grid;
