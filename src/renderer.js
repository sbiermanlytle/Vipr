// src/renderer.js


export function render2(gl, program, buffers) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
}

export function render(ctx, programInfo, buffers) {
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
