/*
  An npm library that creates the Consolidating Coinjoin Network (ccNet) class.
  This class object is used to join the peer-to-peer network.
*/

"use strict";

const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

// Load locally saved data.
const ccoinjoinBootstrap = require("./data/ccoinjoin-bootstrap.json")
const knownServers = require("./data/known-servers.json")

const util = require("util");
util.inspect.defaultOptions = { depth: 1 };

class CCNet {
  // Connect to the IPFS network and load the DB.
  constructor() {
    // Load the initial bootstrap peers
    this.bootstrap = ccoinjoinBootstrap.ccoinjoinBootstrap


    this.ipfs = {}; // Will contain an instance of IPFS.
    this.db = {}; // Will contain an instance of the OrbitDB.
    this.ipfsIsReady = false; // Flag to signal when IPFS is ready.
    this.dbHasSynced = false; // Flag to signal when the DB has synced at least once.
  }

  // Connect to the IPFS network.
  // Returns a promise that resolves to true when the IPFS network is connected
  // and the OrbitDB has been loaded.
  // Testing new circuit relay experimental module.
  async connectToIPFS() {
    return new Promise((resolve, reject) => {
      try {
        // OrbitDB uses Pubsub which is an experimental feature and needs to be
        // turned on manually.
        const ipfsOptions = {
          start: true,
          EXPERIMENTAL: {
            pubsub: true,
          },
          relay: {
            enabled: true, // enable circuit relay dialer and listener
            hop: {
              enabled: true // enable circuit relay HOP (make this node a relay)
            }
          },
          pubsub: true
        };

        const ipfs = new IPFS(ipfsOptions);

        ipfs.on("error", err => console.error(err));

        // Once IPFS is ready, initialize the DB.
        ipfs.on("ready", async () => {
          console.log("IPFS is ready.");
          this.ipfsIsReady = true;

          // Save local instances of ipfs and the db.
          this.ipfs = ipfs;

          return resolve(true)
        });
      } catch (err) {
        console.log(`Error in ccoinjoin-network/connectToIPFS().`);
        return reject(err);
      }
    });
  }

  // Connects to an OrbitDB. Assumes IPFS has already established a connection.
  async connectToOrbitDB(orbitAddr) {
    // Create OrbitDB instance
    const orbitdb = new OrbitDB(this.ipfs);
    let db

    if(!orbitAddr) {
      const access = {
        // Give write access to everyone
        write: ["*"]
      };

      db = await orbitdb.eventlog("ccoinjoin", access);
      console.log(`New ccoinjoin DB created. DB ID: ${db.id}`)
    }

    else {
      console.log(`Connecting to OrbitDB ${orbitAddr}`)
      db = await orbitdb.eventlog(orbitAddr);
    }

    // Load any saved state from disk.
    await db.load();

    // Save local instances of ipfs and the db.
    this.db = db;

    // React to DB update events.
    db.events.on("replicated", () => {
      console.log(`replication event fired`);
      this.dbHasSynced = true;
    });

    return db
  }

  // Returns an array of the last 100 entries from the log DB.
  // latest[0] should be the latest entry, with latest[99] being the oldest.
  // Ordering is subject to network latency and CRDT algorithm.
  async readDB() {
    const latest = this.db.iterator({ limit: 100 }).collect();
    //return latest.reverse()
    return latest
  }

  // Writes a JSON object to the log DB.
  // Returns false if the db has not yet synced.
  async writeDB(data) {
    //if (!this.dbHasSynced) return false;

    // Input validation code here.

    return await this.db.add(data);
  }

  //Update List - Update the list of IPFS bootstrap servers, and validate the list
  // of Consolidating CoinJoin servers.

  // Broadcast server.
}

module.exports = CCNet;
