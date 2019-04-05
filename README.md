# vipr [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sbiermanlytle/vipr/blob/master/LICENSE) [![npm version](https://img.shields.io/badge/npm-1.0.0-green.svg)](https://www.npmjs.com/package/vipr)

WebGL API

## Vocab

- Buffers: arrays of binary data that are uploaded to the GPU (positions, normals, texture coordiinates, vertex colors, anything you want)

- Attributes: specify how to pull data out of a buffer (which buffer, which data type, offset to start at, number of bytes for each segment of data)

- Uniforms: global variables for the shader program

## Shader Notes

- Vertex shader provides clipspace coordinates
- Fragment shader provides the color

- all shaders have a main() function

- `gl_Position` must be set by the vertex shader
- `gl_FragColor ` must be set by the fragment shader

## General Notes

- range is [-1,1] for colors and clipspace coordinates

## Optimization Notes

- Looking up attribute locations (and uniform locations) is something you should do during initialization, not in your render loop.