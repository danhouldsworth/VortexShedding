"use strict"; /* jshint
browser : true
*/

const initGPUMath = () => {

    const glBoilerplate   = initBoilerPlate();
    const canvas          = document.getElementById("glcanvas");
    const gl              = canvas.getContext("webgl", {antialias:false});
    gl.getExtension("OES_texture_float");
    gl.disable(gl.DEPTH_TEST);

    console.log("maxTexturesInFragmentShader = " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));

    const GPUMath = function(){
        this.programs       = {};
        this.frameBuffers   = {};
        this.textures       = {};
        this.index          = 0;
    };

    GPUMath.prototype.createProgram = function(programName, vertexShader, fragmentShader){
        const programs = this.programs;
        const program = glBoilerplate.createProgramFromScripts(gl, vertexShader, fragmentShader);
        gl.useProgram(program);
        glBoilerplate.loadVertexData(gl, program);
        programs[programName] = {
            program: program,
            uniforms: {}
        };
    };

    GPUMath.prototype.initTextureFromData = function(name, width, height, typeName, data){
        this.textures[name] = glBoilerplate.makeTexture(gl, width, height, gl[typeName], data);
    };

    GPUMath.prototype.initFrameBufferForTexture = function(textureName){
        const texture     = this.textures[textureName];
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        this.frameBuffers[textureName] = framebuffer;
    };

    GPUMath.prototype.setUniformForProgram = function(programName, name, val, type){
        gl.useProgram(this.programs[programName].program);
        const uniforms = this.programs[programName].uniforms;
        let location = uniforms[name];
        if (!location) {
            location = gl.getUniformLocation(this.programs[programName].program, name);
            uniforms[name] = location;
        }
        if (type == "1f") gl.uniform1f(location, val);
        else if (type == "2f") gl.uniform2f(location, val[0], val[1]);
        else if (type == "3f") gl.uniform3f(location, val[0], val[1], val[2]);
        else if (type == "1i") gl.uniform1i(location, val);
    };

    GPUMath.prototype.setSize = function(width, height){
        gl.viewport(0, 0, width, height);
    };

    GPUMath.prototype.setProgram = function(programName){
        gl.useProgram(this.programs[programName].program);
    };

    GPUMath.prototype.step = function(programName, inputTextures, outputTexture){
        gl.useProgram(this.programs[programName].program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
        for (let i = 0; i < inputTextures.length; i++){
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//draw to framebuffer
    };

    GPUMath.prototype.swapTextures = function(texture1Name, texture2Name){
        let temp = this.textures[texture1Name];
        this.textures[texture1Name] = this.textures[texture2Name];
        this.textures[texture2Name] = temp;
        temp = this.frameBuffers[texture1Name];
        this.frameBuffers[texture1Name] = this.frameBuffers[texture2Name];
        this.frameBuffers[texture2Name] = temp;
    };

    return new GPUMath();
}