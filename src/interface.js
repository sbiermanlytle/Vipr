// src/objects/Interface.js

// Definition
export function Interface() {
  this.Interface.apply(this, arguments)  
}

// Constructor
Interface.prototype.Interface = function() {
  this.set(arguments[0], true);
}

// Functions
Interface.prototype.set = function() {
  for (var p in arguments[0]) this[p] = arguments[0][p];
  return this;
}

Interface.prototype.toString = function() {
  console.log('Interface to String');
}
