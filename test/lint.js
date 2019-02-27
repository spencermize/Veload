var V = require('../src/js/modules/Veload.js');
var Trail = require('../src/js/modules/Utils.Trail.js');
var assert = require('chai').assert;

describe('getAvg', function() {
  it(`gets the average speed so far`, function() {
      assert.isNumber(Trail.getAvg());
  });
});