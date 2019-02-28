'use strict';
import { should } from 'chai';
import * as Trail from 'Utils.Trail.js';
import V from './V.js';

window.V = V;
should = should();

describe('getAvg - gets the average speed so far', function() {
  it(`empty`, function() {
      Trail.getAvg().should.be.a('number');
  });
  it(`miles`, function() {
    Trail.getAvg("miles").should.be.a('number');
  });
  it(`meters`, function() {
    Trail.getAvg("meters").should.be.a('number');
  });  
});

describe('getDistance - gets the distance so far',function(){
  it(`empty`, function() {
    Trail.getDistance().should.be.a('number');
  });  
  it(`meters / estimate`, function() {
    Trail.getDistance("meters").should.be.a('number');
  });
  it(`meters / verified only`, function() {
    Trail.getDistance("meters",true).should.be.a('number');
  });  
})
