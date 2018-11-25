/*
  An npm library that creates the Consolidating Coinjoin Network (ccNet) class.
  This class object is used to join the peer-to-peer network.
*/

"use strict";

const ipfsData = require('./data/ipfs-bootstrap.json')
const ccoinjoinData = require('./data/ccoinjoin-bootstrap.json')

const util = require("util");
util.inspect.defaultOptions = {depth: 1};

class CCNet {
  constructor() {
    //console.log(`ipfsBootstrap: ${util.inspect(ipfsBootstrap)}`)
    this.bootstrap = ipfsData.ipfsBootstrap.concat(ccoinjoinData.ccoinjoinBootstrap)
  }
}

module.exports = CCNet;
