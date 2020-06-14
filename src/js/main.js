let Grid = require('renderer/Grid.js');
let Texture = require('renderer/Texture.js');
let Fallback = require('renderer/Fallback.js');
let ShaderProgram = require('renderer/ShaderProgram.js');
let WebGLCanvas = require('renderer/WebGLCanvas.js');



const fps = {
    sampleSize : 60,
    value : 0,
    _sample_ : [],
    _index_ : 0,
    _lastTick_: false,
    tick : function(){
        // if is first tick, just set tick timestamp and return
        if( !this._lastTick_ ){
            this._lastTick_ = performance.now();
            return 0;
        }
        // calculate necessary values to obtain current tick FPS
        let now = performance.now();
        let delta = (now - this._lastTick_)/1000;
        let fps = 1/delta;
        // add to fps samples, current tick fps value
        this._sample_[ this._index_ ] = Math.round(fps);

        // iterate samples to obtain the average
        let average = 0;
        for(i=0; i<this._sample_.length; i++) average += this._sample_[ i ];

        average = Math.round( average / this._sample_.length);

        // set new FPS
        this.value = average;
        // store current timestamp
        this._lastTick_ = now;
        // increase sample index counter, and reset it
        // to 0 if exceded maximum sampleSize limit
        this._index_++;
        if( this._index_ === this.sampleSize) this._index_ = 0;
        return this.value;
    }
}



function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.bindMat4(shader.locateUniform("uProjection"), g_canvas.projectionMatrix);
    grid.render(performance.now());

    window.requestAnimationFrame(render);

}


function init() {
    g_canvas = new WebGLCanvas('back');
    if (!g_canvas)
        Fallback.NoWebGL();

    back = new Texture('assets/img/back04.jpg');

    shader = new ShaderProgram();
    shader.addStage(document.getElementById('vert').innerHTML, gl.VERTEX_SHADER);
    shader.addStage(document.getElementById('frag').innerHTML, gl.FRAGMENT_SHADER);
    shader.link();

    grid = new Grid(shader);
    grid.bindTexture(back);

    render();
}

init();
