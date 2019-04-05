import { vsSource, fsSource } from './shaders.js';
import { App } from './app.js';

export function randomInt(range) {
  return Math.floor(Math.random() * range);
}

export function sinAndCosForAngle(angleInDegrees) {
  var angleInRadians = angleInDegrees * Math.PI / 180;
  var s = Math.sin(angleInRadians);
  var c = Math.cos(angleInRadians);
  return {
    sin: s,
    cos: c
  }
}

export function start( script, id ) {
  const canvas = document.getElementById(id);

  if (script instanceof Array)
    return new App(canvas, script[0], script[1]);
  return new App(canvas, script);
}

// Initialize the buffers we'll need.
export function createBuffer(gl, positions) {
  // Create a buffer for geometry
  const buffer = gl.createBuffer();

  // Select the buffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);  

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  return buffer;
}

// creates a shader of the given type and compiles it.
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// create a shader program, so WebGL knows how to draw our data
export function createShaderProgram(gl, vertexShader, fragmentShader) {
  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}
