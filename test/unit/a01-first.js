/*
*/


"use strict"

const assert = require('chai').assert
const hello = require('../../index')

describe('Function', () => {
  describe('Feature', () => {
    it('should run a test', () => {
      hello.helloWorld()
      assert.equal(true,true)
    })
  })
})
