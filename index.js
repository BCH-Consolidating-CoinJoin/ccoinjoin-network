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
  // Connect to the IPFS network and load the DB.
  constructor() {
    //console.log(`ipfsBootstrap: ${util.inspect(ipfsBootstrap)}`)
    this.bootstrap = ipfsData.ipfsBootstrap.concat(ccoinjoinData.ccoinjoinBootstrap)
  }

  //Update List - Update the list of IPFS bootstrap servers, and validate the list
  // of Consolidating CoinJoin servers.

  // Broadcast server.
}

module.exports = CCNet;
