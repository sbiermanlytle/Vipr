(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.vipr = {}));
}(this, function (exports) { 'use strict';

  const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

  // Fragment shader program

  const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

  // src/objects/Interface.js

  // Definition
  function Interface() {
    this.Interface.apply(this, arguments);  
  }

  // Constructor
  Interface.prototype.Interface = function() {
    this.set(arguments[0], true);
  };

  // Functions
  Interface.prototype.set = function() {
    for (var p in arguments[0]) this[p] = arguments[0][p];
    return this;
  };

  Interface.prototype.toString = function() {
    console.log('Interface to String');
  };

  function inherit(child, parent) {
    function emptyFn(){}  var tmp = child;
    emptyFn.prototype = parent.prototype;
    child.prototype = new emptyFn();
    child.prototype.constructor = tmp;
  }

  // src/objects/App.js

  // Definition
  function App() {
    this.App.apply(this, arguments);
  }

  inherit(App, Interface);
  App.prototype._super = Interface.prototype;

  // Constructor
  App.prototype.App = function(canvas, script, settings) {
    this._super.Interface.call(this);

    // set app reference for shared functions
    this.app = this;
    this.canvas = canvas;
    this.initContext(canvas, settings);

    // add to global apps list
    vipr.apps.push(this);

    this.script = new script(this, settings);
  };

  // Functions
  App.prototype.initContext = function(canvas, settings) {
    if (settings && settings.webgl === false) {
      this.ctx = canvas.getContext('2d');
      this.webgl = false;
      return;
    }
    this.ctx = canvas.getContext('webgl');
    if (!this.ctx) {
      console.warn('[vipr] cannot load webgl context, falling back to 2d');
      this.ctx = canvas.getContext('2d');
      this.webgl = false;
      return;
    }
    this.webgl = true;
  };

  App.prototype.toString = function() {
    console.log('App to String....');
  };

  function randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  function sinAndCosForAngle(angleInDegrees) {
    var angleInRadians = angleInDegrees * Math.PI / 180;
    var s = Math.sin(angleInRadians);
    var c = Math.cos(angleInRadians);
    return {
      sin: s,
      cos: c
    }
  }

  function start( script, id ) {
    const canvas = document.getElementById(id);

    if (script instanceof Array)
      return new App(canvas, script[0], script[1]);
    return new App(canvas, script);
  }

  // Initialize the buffers we'll need.
  function createBuffer(gl, positions) {
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
  function createShader(gl, type, source) {
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
  function createShaderProgram(gl, vertexShader, fragmentShader) {
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

  // src/renderer.js


  function render2(gl, program, buffers) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
  }

  function render(ctx, programInfo, buffers) {
    // ctx.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    ctx.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    ctx.clearDepth(1.0);                 // Clear everything
    ctx.enable(ctx.DEPTH_TEST);           // Enable depth testing
    ctx.depthFunc(ctx.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;
      const type = ctx.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position);
      ctx.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      ctx.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
    ctx.useProgram(programInfo.program);

    // Set the shader uniforms
    ctx.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    ctx.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
      const offset = 0;
      const vertexCount = 4;
      ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount);
    }
  }

  const apps = [];

  exports.App = App;
  exports.apps = apps;
  exports.createBuffer = createBuffer;
  exports.createShader = createShader;
  exports.createShaderProgram = createShaderProgram;
  exports.fsSource = fsSource;
  exports.randomInt = randomInt;
  exports.render = render;
  exports.render2 = render2;
  exports.sinAndCosForAngle = sinAndCosForAngle;
  exports.start = start;
  exports.vsSource = vsSource;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
