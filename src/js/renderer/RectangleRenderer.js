var ShaderProgram = require('renderer/ShaderProgram.js');



function RectangleRenderer() {
    this.shader = new ShaderProgram();
    this.shader.addStage(document.getElementById('rectVertex').innerHTML, gl.VERTEX_SHADER);
    this.shader.addStage(document.getElementById('rectFragment').innerHTML, gl.FRAGMENT_SHADER);
    this.shader.link();
    this.locVertices = this.shader.locateAttrib("aVertices");
    this.locProjection = this.shader.locateUniform("uProjection");
    this.locPos = this.shader.locateUniform("uPos");
    this.locColor = this.shader.locateUniform("uColor");

    let vertices = new Float32Array(12);
    vertices[0 ] = 0.0; vertices[1 ] = 0.0;
    vertices[2 ] = 1.0; vertices[3 ] = 0.0;
    vertices[4 ] = 1.0; vertices[5 ] = 1.0;
    vertices[6 ] = 0.0; vertices[7 ] = 0.0;
    vertices[8 ] = 1.0; vertices[9 ] = 1.0;
    vertices[10] = 0.0; vertices[11] = 1.0;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

}


RectangleRenderer.prototype.draw = function(x, y, width, height, color = {r:0,g:255.0,b:128,a:0.4}) {
    let oldShader = this.shader.use();

    gl.enableVertexAttribArray(this.locVertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.locVertices, 2, gl.FLOAT, false, 0, 0);

    this.shader.bind4f(this.locPos, x, y, width, height);
    this.shader.bind4f(this.locColor, color.r, color.g, color.b, color.a);
    this.shader.bindMat4(this.locProjection, g_canvas.projectionMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    oldShader.use();
}

module.exports = RectangleRenderer;
