function createWebGLCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl)
        throw new Error("WebGL not supported?");

    console.log('Using ' + gl.getParameter(gl.VERSION) +
                ' with ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) +
                ' from ' + gl.getParameter(gl.VENDOR) + '.');

    return {
        canvas: canvas,
        gl: gl
    };
}

module.exports = createWebGLCanvas;
