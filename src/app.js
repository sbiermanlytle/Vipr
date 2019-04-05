// src/objects/App.js

import { Interface } from './interface.js';
import { inherit } from './util.js';

// Definition
export function App() {
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
}

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
}

App.prototype.toString = function() {
  console.log('App to String....');
}
