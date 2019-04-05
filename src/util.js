export function inherit(child, parent) {
  function emptyFn(){};
  var tmp = child;
  emptyFn.prototype = parent.prototype;
  child.prototype = new emptyFn();
  child.prototype.constructor = tmp;
}
