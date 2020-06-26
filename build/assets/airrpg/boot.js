function resizeGameCanvas() {
    // Calculate initial width & height
    let maxGameWidth = 480 * Math.floor(window.innerHeight * 0.9 / 320);
    let pageWidth = 2 * window.innerWidth - document.documentElement.clientWidth;
    let gameWidth = Math.max(480, Math.min(Math.floor(pageWidth / 480) * 480, maxGameWidth));
    let gameHeight = (320 / 480) * gameWidth;

    // Limit by height
    if (gameHeight > window.innerHeight) {
        gameHeight = Math.max(window.innerHeight, Math.min(Math.floor(window.innerHeight / 320) * 320, window.innerHeight));
        gameWidth = (480 / 320) * gameHeight;
    }

    // Set game canvas dimensions
    let el_gameDiv = document.getElementById('gameDivId');
    el_gameDiv.style.marginLeft = (-(gameWidth/2)) + 'px';
    el_gameDiv.style.marginTop = (-(gameHeight/2)) + 'px';
    let el_canvas = document.getElementById('canvas');
    el_canvas.style.width = gameWidth+'px';
    el_canvas.style.height = gameHeight+'px';

    // Background tile scaling
    let scale = gameWidth / 480;
    let el_body = document.body;
    el_body.style.backgroundSize = 32*scale+'px,'+32*scale+'px';
}
window.addEventListener("resize", resizeGameCanvas);
resizeGameCanvas();
