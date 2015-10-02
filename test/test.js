import React from 'react';
import ReactAddons from 'react/addons';
let TestUtils = React.addons.TestUtils;
import chai from 'chai';
let should = chai.should();


import MyComponent from '../src/static/scripts/mocktest';
describe('MyComponent', () => {
    it('should give me a prop', () => {
            let content = TestUtils.renderIntoDocument(
              <MyComponent name="mix" />
            );

            let div = TestUtils.findRenderedDOMComponentWithTag(content, 'div');

            let copy = React.findDOMNode(div).textContent;
            copy.should.equal('meow mix');

        let foo = 'stringgg';
        foo.should.be.a('string');
    });
});

// http://mochajs.org/#getting-started
let assert = require('assert');
describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

// Using chai should instead of assert
describe('meep',() => {
    it('should do thangs',() => {
        let foo = 'stringgg';
        foo.should.be.a('string');
    });
});
