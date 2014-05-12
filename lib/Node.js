function Node(value) {
  this._value = value;
}

Node.prototype.getValue = function () {
  return this._value;
};

Node.prototype.getNext = function () {
  return this._next;
}