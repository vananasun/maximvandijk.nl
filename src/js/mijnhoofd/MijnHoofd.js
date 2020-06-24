let WebGLCanvas = require('renderer/WebGLCanvas.js');



MijnHoofd = function(canvasId = 'mijnhoofd__canvas') {
    this.canvas = document.getElementById(canvasId);

    _gl = this.canvas.getContext('webgl', {antialias: false});
    if (!_gl) return false;


    _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
    this.projectionMatrix = WebGLCanvas.ortho(0,this.canvas.clientWidth, this.canvas.clientHeight,0, -1,1);

    _gl.clearColor(0,0,0,.1);
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}

MijnHoofd.prototype.render = function(t) {
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}


module.exports = MijnHoofd;
