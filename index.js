/*
  An npm library that creates the Consolidating Coinjoin Network (ccNet) class.
  This class object is used to join the peer-to-peer network.
*/

"use strict";

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

// Load locally saved data.
const ipfsData = require('./data/ipfs-bootstrap.json')
const ccoinjoinData = require('./data/ccoinjoin-bootstrap.json')

const util = require("util");
util.inspect.defaultOptions = {depth: 1};

class CCNet {
  // Connect to the IPFS network and load the DB.
  constructor() {
    this.bootstrap = ipfsData.ipfsBootstrap.concat(ccoinjoinData.ccoinjoinBootstrap)
    this.ipfs = {} // Will contain an instance of IPFS.
    this.db = {} // Will contain an instance of the OrbitDB.
  }

  // Connect to the IPFS network
  async connectToIPFS() {
    // OrbitDB uses Pubsub which is an experimental feature and needs to be
    // turned on manually.
    const ipfsOptions = {
      start: true,
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        // Override default bootstrap list with save list of bootstrap peers.
        Bootstrap: this.bootstrap
      }
    }

    const ipfs = new IPFS(ipfsOptions)

    ipfs.on('error', err => console.error(err))

    // Once IPFS is ready, initialize the DB.
    ipfs.on('ready', async () => {
      console.log('IPFS is ready.')

      console.log(`ipfs: ${util.inspect(ipfs)}`)

      await this.openDB(ipfs)
    })
  }

  // Called by the ipfs on.ready event. Opens the DB and loads locally saved data.
  async openDB(ipfs) {
    const access = {
      // Give write access to everyone
      write: ['*']
    }

    // Create OrbitDB instance
    const orbitdb = new OrbitDB(ipfs)

    // Instantiate the ccoinjoin database.
    const db = await orbitdb.eventlog('ccoinjoin', access)

    // Load any saved state from disk.
    await db.load()

    // React to DB update events.
    db.events.on('replicated', () => {
      console.log(`replication event fired`)
    })
  }

  //Update List - Update the list of IPFS bootstrap servers, and validate the list
  // of Consolidating CoinJoin servers.

  // Broadcast server.
}

module.exports = CCNet;
