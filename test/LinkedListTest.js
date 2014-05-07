var LinkedList = require('../LinkedList');
var expect = require('expect.js');

describe('LinkedList', function () {
  describe('#insert, #seek, #currentValue, #resetIndex', function () {
    it('should be able to insert elements of an unordered list, and get back an ordered list', function () {
      function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };
      var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var shuffled = shuffle(arr.slice());
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
});