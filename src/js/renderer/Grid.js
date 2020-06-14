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
    // this.locResolution = shader.locateUniform("uResolution");
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
    if (!this.texture.loaded) return;
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
    let drawHeight = gl.drawingBufferWidth / this.texture.getAspect();
    this.shader.bind1f(this.locTime, time);
    this.shader.bind2f(this.locPos, 0, 0);
    this.shader.bind2f(this.locSize, gl.drawingBufferWidth, drawHeight);

    // bind texture and draw
    this.shader.bindSampler(this.locSampler, this.texture.id);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    if (oldShader) oldShader.use();
}



module.exports = Grid;
