//from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
"use strict"; /*jshint
browser:true
*/

function initBoilerPlate(){

    function compileShader(gl, shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {throw "could not compile shader:" + gl.getShaderInfoLog(shader);}

        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {throw ("program filed to link:" + gl.getProgramInfoLog (program));}

        return program;
    }

    function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
        const vertexShader      = createShaderFromScript(gl, vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader    = createShaderFromScript(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
        return createProgram(gl, vertexShader, fragmentShader);
    }

    function createShaderFromScript(gl, scriptId, opt_shaderType) {
        const shaderScript = document.getElementById(scriptId);
        const shaderSource = shaderScript.text;
        return compileShader(gl, shaderSource, opt_shaderType);
    }

    function loadVertexData(gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1,-1, 1,-1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    function makeTexture(gl, width, height, type, data){
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);

        return texture;
    }

    return {
        createProgramFromScripts  : createProgramFromScripts,
        loadVertexData            : loadVertexData,
        makeTexture               : makeTexture
    };
}