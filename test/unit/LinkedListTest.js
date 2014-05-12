var LinkedList = require('../../lib/LinkedList');
var expect = require('expect.js');
var helpers = require('../../lib/helpers');

describe('LinkedList', function () {
  describe('#insert, #seek, #currentValue, #resetIndex', function () {
    it('should be able to insert elements of an unordered list, and get back an ordered list', function () {
      var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var shuffled = helpers.shuffle(arr.slice());
      expect(shuffled).to.not.eql(arr);
      var list = new LinkedList(function (a, b){ 
        return a - b;
      });
      shuffled.forEach(function (element) {
        list.insert(element);
      });
      list.resetIndex();
      var ordered = [list.currentValue()];
      while (list.seek()) {
        ordered.push(list.currentValue());
      }
      expect(ordered).to.eql(arr);
    });
  });
  describe('#insert, #clear', function () {
    it('should be able to insert elements, and then clear all elements', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      var i = 1;
      while (list.seek()) {
        i++;
      }
      expect(i).to.be(5);
      list.clear(0);
      expect(list._childNode).to.be(null);
      expect(list._currentNode).to.be(null);
    });
  });
  describe('#nextValue', function () {
    it('should be able to get the current node\'s child node\'s value', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.nextValue()).to.be(2);
    });
  });
  describe('#hasNext', function () {
    it('should return false when the current node is at the head of the list', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      while (list.seek()) {}
      expect(list.hasNext()).to.be(false);
    });
    it('should return true when the current node is not at the head of the list', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.hasNext()).to.be(true);
      list.seek();
      expect(list.hasNext()).to.be(true);
    });
  });
  describe('#hasValue', function () {
    it('should return false when there aren\'t anything on the list', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      expect(list.hasValue()).to.be(false);
    });
    it('should return true when there is one thing on the list', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      list.insert(1);
      expect(list.hasValue()).to.be(true);
    });
    it('should return true when there are many things on the list', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.hasValue()).to.be(true);
    });
    it('should return false when there are\'t anything on the list, *after* `clear` has been called', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.hasValue()).to.be(true);
      list.clear();
      expect(list.hasValue()).to.be(false);
    });
    it('should return true when there is something on the list, *after* `clear` has been called and elements have been added', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.hasValue()).to.be(true);
      list.clear();
      expect(list.hasValue()).to.be(false);
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      expect(list.hasValue()).to.be(true);
    });
  });
  describe('#toArray', function () {
    it('should take the element in the list and turn it into an array', function () {
      var list = new LinkedList(function (a, b) {
        return a - b;
      });
      [1, 2, 3, 4, 5].forEach(function (element) {
        list.insert(element);
      });
      var arr = list.toArray().map(function (a) { return a.toString(); }).join('');
      expect(arr).to.be('12345');
    });
  });
});