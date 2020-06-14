/**
 * Usage order:
 * - new ShaderProgram object
 * - add stages
 * - link stages
 * - use ShaderProgram
 *
 * @author Maxim van Dijk
 */



/**
 * @constructor
 */
function ShaderProgram() {
    /** @member {WebGLProgram} */
    this.program = gl.createProgram();
}

/**
 * @property {ShaderProgram} The currently bound shader.
 */
ShaderProgram.BoundShader = null;



/**
 * Add a stage to the shader program.
 *
 * @param {string} source GLSL code.
 * @param {number} shaderType [ gl.VERTEX_SHADER, gl.FRAGMENT_SHADER ]
 */
ShaderProgram.prototype.addStage = function(source, stage) {
    // Compile shader stage
    let shader = gl.createShader(stage);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let type = stage == gl.VERTEX_SHADER ? 'vertex' : 'fragment';
        console.error('Error compiling '+type+' shader:\n'+gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    // Attach shader stage to program
    gl.attachShader(this.program, shader);
}

/**
 * Link shader program stages to complete the shader for usage.
 */
ShaderProgram.prototype.link = function() {
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error('Error linking program "'+this.program+'": '+gl.getProgramInfoLog(this.program));
        gl.deleteProgram(this.program);
    }
}



/**
 * Find the location of the given attribute in the program.
 *
 * @param {string} name The attribute name.
 *
 * @return {number} Found attribute location, -1 on failure.
 */
ShaderProgram.prototype.locateAttrib = function(name) {
    let loc = gl.getAttribLocation(this.program, name);
    if (-1 == loc) console.error('Unable to find attribute "'+name+'"\'s location');
    return loc;
}

/**
 * Find the location of the given uniform in the program.
 *
 * @param {string} name The uniform name.
 *
 * @return {number} Found uniform location, -1 on failure.
 */
ShaderProgram.prototype.locateUniform = function(name) {
    let loc = gl.getUniformLocation(this.program, name);
    if (null == loc) {
        console.error('Unable to find uniform "'+name+'"\'s location');
        return -1;
    }
    return loc;
}

/**
 * Binds a texture sampler to the shader.
 *
 * @param {WebGLUniformLocation} loc     Sampler's uniform location.
 * @param {WebGLTexture}         texture The GL texture object.
 * @param {number}               unit    (optional) GL texture unit to bind to,
 *                                       value must be 0 + n.
 */
ShaderProgram.prototype.bindSampler = function(loc, texture, unit = 0) {
    gl.activeTexture(unit + gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(loc, unit); // funnily enough it has to be 0 + n in the shader
}

/** @TODO: Implement gl.vertexAttrib3f etc... */

/**
 * Bind float uniform.
 *
 * @param {WebGLUniformLocation} loc
 * @param {number}               x
 */
ShaderProgram.prototype.bind1f = function(loc, x) {
    gl.uniform1f(loc, x);
}

/**
 * Bind vec2 uniform.
 *
 * @param {WebGLUniformLocation} loc
 * @param {number}               x
 * @param {number}               y
 */
ShaderProgram.prototype.bind2f = function(loc, x, y) {
    gl.uniform2f(loc, x, y);
}

/**
 * Bind vec4 uniform.
 *
 * @param {WebGLUniformLocation} loc
 * @param {number}               r
 * @param {number}               g
 * @param {number}               b
 * @param {number}               a
 */
ShaderProgram.prototype.bind4f = function(loc, r, g, b, a) {
    gl.uniform4f(loc, r, g, b, a);
}

/**
 * Bind 4x4 matrix to uniform.
 *
 * @param {WebGLUniformLocation} loc
 * @param {Float32Array|array}   matrix
 */
ShaderProgram.prototype.bindMat4 = function(loc, matrix) {
    gl.uniformMatrix4fv(loc, false, matrix);
}



/**
 * Bind the shader.
 *
 * @return {ShaderProgram} Previously bound shader.
 */
ShaderProgram.prototype.use = function() {
    let old = ShaderProgram.BoundShader;
    gl.useProgram(this.program);
    ShaderProgram.BoundShader = this;
    return old ? old : this;
}



module.exports = ShaderProgram;
