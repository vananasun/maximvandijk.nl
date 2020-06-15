let Grid = require('renderer/Grid.js');
let Texture = require('renderer/Texture.js');
let Fallback = require('renderer/Fallback.js');
let ShaderProgram = require('renderer/ShaderProgram.js');
let RectangleRenderer = require('renderer/RectangleRenderer.js');
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



function render(t) {

    g_canvas.clearCanvas();

    shader.bindMat4(shader.locateUniform("uProjection"), g_canvas.projectionMatrix);
    
    if (grid.render(t) && fadeInOpacity > 0.0) {
        g_rectangleRenderer.draw(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, {r:0,g:0,b:0,a:fadeInOpacity});
        fadeInOpacity -= fadeSpeed;
    }

    window.requestAnimationFrame(render);

}


function init() {
    g_canvas = new WebGLCanvas('back');
    if (!g_canvas)
        Fallback.NoWebGL();
    g_rectangleRenderer = new RectangleRenderer();
    fadeSpeed = 1 / 60;
    fadeInOpacity = 1.0 - fadeSpeed;

    // back = new Texture('assets/img/back06_q30_1920x1280.webp');
    // back = new Texture('assets/img/back06_q30_3120x2080.webp');
    // back = new Texture('assets/img/back06_q30_6240x4160.webp');
    // back = new Texture('assets/img/back07_q30_5760x3840.webp');
    let backgrounds = [
        'assets/img/back01.jpg',
        'assets/img/back02.jpg',
        'assets/img/back03.jpg',
        'assets/img/back04.jpg',
        'assets/img/back05.jpg',
        'assets/img/back06_q30_3120x2080.web',
        'assets/img/back07_q30_5760x3840.webp',
    ];
    let selectedUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    back = new Texture(selectedUrl);

    shader = new ShaderProgram();
    shader.addStage(document.getElementById('vert').innerHTML, gl.VERTEX_SHADER);
    shader.addStage(document.getElementById('frag').innerHTML, gl.FRAGMENT_SHADER);
    shader.link();

    grid = new Grid(shader);
    grid.bindTexture(back);

    render();
}

init();
