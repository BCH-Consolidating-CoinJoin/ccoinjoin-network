/*
*/


"use strict"

const assert = require('chai').assert
const CCNet = require('../../index')

describe('Function', () => {
  describe('Feature', () => {
    it('should run a test', () => {
      const ccNet = new CCNet()

      assert.isArray(ccNet.bootstrap)
    })
  })
})
