var createShader = require("gl-shader");
var glslAudioWrapper = require("./glslAudioWrapper");

// Basic square vertex (2 triangles)
var VERT_SHADER = 'precision highp int;precision highp float;attribute vec2 position; void main() { gl_Position = vec4(2.0*position-1.0, 0.0, 1.0);}';

// Create a generator from a "webglcanvas", a sampleRate and a GLSL Code containing a dsp function
function createGenerator (webGLCanvas, sampleRate, dspCode) {
    var canvas = webGLCanvas.canvas;
    var gl = webGLCanvas.gl;
    var fragShader = glslAudioWrapper(dspCode);

    // Create and bind the shader
    var shader = createShader(gl, VERT_SHADER, fragShader);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    shader.attributes.position.pointer();
    shader.bind();

    // Create input texture
    var w = canvas.width, h = canvas.height;
    var texInput = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texInput);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);


    // Sync the viewport size
    gl.viewport(0, 0, w, h);
    shader.uniforms.Resolution = new Float32Array([ w, h ]);
    shader.uniforms.SampleRate = sampleRate;
    shader.uniforms.InpTex = texInput;
    var x1 = 0, x2 = w, y1 = 0, y2 = h;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);

    // Returns a generate function which returns the pixel buffer of the canvas from a given bufferTime
    function generate (bufferTime, channel, optionalBuffer, uniforms) {

        // Bind shader with uniforms
        shader.bind();
        shader.uniforms.BufferTime = bufferTime / sampleRate;
        shader.uniforms.Channel = channel;
        Object.keys(uniforms).forEach(function(key) {
            shader.uniforms[key] = uniforms[key];
        });


        let buffer = optionalBuffer || new Uint8Array(w * h * 4);
        // for(let i =0; i < buffer.length;i++){
        //    buffer[i] += Math.floor(Math.random()*16);//i % 255;
        // }

        //
        gl.bindTexture(gl.TEXTURE_2D, texInput);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        return buffer;

        // // Bind shader with uniforms
        // shader.bind();
        // shader.uniforms.BufferTime = bufferTime / sampleRate;
        // shader.uniforms.Channel = channel;
        // Object.keys(uniforms).forEach(function(key) {
        //     shader.uniforms[key] = uniforms[key];
        // });
        //
        // let buffer = optionalBuffer || new Uint8Array(w * h * 4);
        // // for(let i =0; i < buffer.length;i++){
        // //    buffer[i] += Math.floor(Math.random()*16);//i % 255;
        // // }
        //
        // //
        // gl.bindTexture(gl.TEXTURE_2D, texInput);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        // gl.bindTexture(gl.TEXTURE_2D, null);
        // gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        // return buffer;
    };
    generate.destroy = function () {
        shader.dispose();
        gl.deleteTexture(texInput);
    };
    return generate;
}

module.exports = createGenerator;
