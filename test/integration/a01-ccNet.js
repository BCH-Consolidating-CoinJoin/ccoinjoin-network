/*
*/


"use strict"

const assert = require('chai').assert
const CCNet = require('../../index')

describe('ccNet', () => {
  describe('constructor()', () => {
    it('should instantiate the class', () => {
      const ccNet = new CCNet()

      assert.isArray(ccNet.bootstrap)
    })
  })

  describe('connectToIPFS()', () => {
    it('should connect to IPFS', () => {
      const ccNet = new CCNet()

      ccNet.connectToIPFS()
    })
  })
})
