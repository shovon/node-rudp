// This is a private class.
function Node(value) {
  this.value = value;
  this._childNode = null;
}

// TODO: do note that this is an ordered linked-list. Perhaps this class should
//     be renamed to better indicate that.
// TODO: use a generator/iterator pattern for looping through the list.

/**
 * Represents a linkedList, and accepts any type, so long as it can be
 * successfully parsed by the ordering function.
 *
 * @class LinkedList
 * @constructor
 */
module.exports = LinkedList;
function LinkedList(orderBy) {
  this._childNode = null;
  this._orderBy = orderBy;
  this._currentNode = null;
}

var InsertionResult = LinkedList.InsertionResult = {
  INSERTED: 'inserted',
  EXISTS: 'exists',
  FAILED: 'failed'
};

LinkedList.prototype.insert = function (object) {
  if (!this._childNode) {
    this._childNode = new Node(object);
    this._currentNode = this._childNode;
    return InsertionResult.INSERTED;
  }
  return this._insert(this, object);
};

LinkedList.prototype.clear = function () {
  this._childNode = null;
  this._currentNode = null;
};

LinkedList.prototype.resetIndex = function () {
  this._currentNode = this._childNode;
};

LinkedList.prototype.seek = function () {
  if (!this._currentNode) {
    return false;
  }

  if (!this._currentNode._childNode) {
    return false;
  }

  this._currentNode = this._currentNode._childNode;
  return true;
};

LinkedList.prototype.currentValue = function () {
  if (!this._currentNode) {
    throw new Error('There aren\'t any nodes on the list.');
  }
  return this._currentNode.value;
};

LinkedList.prototype.hasValue = function () {
  return !!this._childNode;
};

LinkedList.prototype.nextValue = function () {
  if (!this._currentNode) {
    throw new Error('There aren\'t any nodes on the list.');
  } else if (!this._currentNode._childNode) {
    throw new Error('The current node does not have any child nodes');
  }
  return this._currentNode._childNode.value;
};

LinkedList.prototype.hasNext = function () {
  return !!this._currentNode._childNode;
};

LinkedList.prototype.toArray = function () {
  return this._toArray(this, [])
};

LinkedList.prototype._toArray = function (node, accum) {
  if (!node._childNode) { return accum; }
  return this._toArray(node._childNode, accum.concat([node._childNode.value]));
};

LinkedList.prototype._insert = function (parentNode, object) {
  if (!parentNode._childNode) {
    parentNode._childNode = new Node(object);
    return InsertionResult.INSERTED;
  }

  var order = this._orderBy(object, parentNode._childNode.value);

  if (order <= -1) {
    var node = new Node(object);
    node._childNode = parentNode._childNode;
    parentNode._childNode = node;
    return InsertionResult.INSERTED;
  } else if (order >= 1) {
    return this._insert(parentNode._childNode, object);
  } else if (order === 0) {
    return InsertionResult.EXISTS;
  }

  return InsertionResult.FAILED;
};