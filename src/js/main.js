let Fallback = require('Fallback.js');
let g_fps = require('FPS.js');
let Modal = require('Modal.js');
let LocaleManager = require('LocaleManager.js');

let Grid = require('renderer/Grid.js');
let Texture = require('renderer/Texture.js');
let ShaderProgram = require('renderer/ShaderProgram.js');
let RectangleRenderer = require('renderer/RectangleRenderer.js');
let WebGLCanvas = require('renderer/WebGLCanvas.js');
let LazyLoader = require('renderer/LazyLoader.js');
let FilterAnimation = require('renderer/FilterAnimation.js');



const FADE_SPEED = 1 / 23;



function render(t) {

    g_canvas.clearCanvas();

    shader.bindMat4(shader.locateUniform("uProjection"), g_canvas.projectionMatrix);

    if (grid.render(t) && (g_fadeOpacity -= FADE_SPEED) > 0.0) {
        let fadeInColor = {r: 34 / 255, g: 28 / 255, b: 56 / 255, a: g_fadeOpacity};
        g_rectangleRenderer.draw(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, fadeInColor);
    }

    g_filterAnimation.update(t);

    window.requestAnimationFrame(render);

}


function init() {
    g_canvas = new WebGLCanvas('back');
    if (!g_canvas)
        Fallback.NoWebGL();
    g_rectangleRenderer = new RectangleRenderer();
    g_fadeOpacity = 1.0 - FADE_SPEED;


    // Lazily-load background texture
    back = new Texture();
    let backs = [
        'back01',
        'back02',
        'back03',
        'back04',
        'back05',
        'back06',
        'back07'
    ];
    let name = 'assets/img/lazy/' + backs[Math.floor(Math.random() * backs.length)];
    g_lazyLoader = new LazyLoader();
    g_lazyLoader.loadImage(name, function(img) {
        back.uploadImage(img);
    });

    // Setup background shader.
    shader = new ShaderProgram();
    shader.addStage(document.getElementById('vert').innerHTML, gl.VERTEX_SHADER);
    shader.addStage(document.getElementById('frag').innerHTML, gl.FRAGMENT_SHADER);
    shader.link();

    // Create the moving background object.
    grid = new Grid(shader);
    grid.bindTexture(back);

    // Initialize SVG filter animation.
    g_filterAnimation = new FilterAnimation();

    // Make modal and locale objects
    g_modal = new Modal();
    g_locale = new LocaleManager();

    render(0.0);
}

init();
