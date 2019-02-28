import '/js/Utils.Trail.js';
var assert = chai.assert;

describe('getAvg', function() {
  it(`gets the average speed so far`, function() {
      assert.isNumber(getAvg());
  });
});
