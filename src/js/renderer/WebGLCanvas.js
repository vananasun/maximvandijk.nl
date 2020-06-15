function WebGLCanvas(id) {
    this.canvas = document.getElementById(id);
    this.onWindowResize();
    let self = this;
    window.addEventListener("resize", function(){ self.onWindowResize() }, false);

    gl = this.canvas.getContext('webgl', {antialias: false});
    if (!gl) return false;

    // Settings
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0,0,0,1);
    this.clearCanvas();
    return true;
};


/**
 * Generates an orthogonal projection matrix with the given bounds
 *
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {array} out
*/
WebGLCanvas.ortho = function(left, right, bottom, top, near, far) {
    let out = new Float32Array(16);
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
}

WebGLCanvas.prototype.onWindowResize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.projectionMatrix = WebGLCanvas.ortho(0,this.canvas.clientWidth, this.canvas.clientHeight,0, -1,1);
    if ('undefined' === typeof gl) return;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

WebGLCanvas.prototype.clearCanvas = function(self) {
    gl.clear(gl.COLOR_BUFFER_BIT);
};




module.exports = WebGLCanvas;
