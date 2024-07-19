// make a metaQube JSON file
require("dotenv").config();
const fs = require('fs');
const minimist = require('minimist');

// default values
const defaults = {
  schemaIdentifier: "metaQube",
  recordsSchema: null,
  recordChangeability: null,
  ownerType: null,
  subjectIdentifiability: null,
  accuracy: null,
  veracity: null,
  sensitivity: null,
  intrinsicRisk: null,
  contextualRisk: null,
  cid: "0xdeadbeef",
  did: "did:key:z6Mkt2EfbEu1swsrVNNWMHMSQLgFWVfgjnP7TBAUNbzTVPTi"
};

// parse command-line args
const args = minimist(process.argv.slice(2), {
  string: [
    'schemaIdentifier',
    'recordsSchema',
    'recordChangeability',
    'ownerType',
    'subjectIdentifiability',
    'accuracy',
    'veracity',
    'sensitivity',
    'intrinsicRisk',
    'contextualRisk',
    'cid',
    'did'
  ],
  default: defaults
});

// Create the metaQube object
const metaQube = {
  schemaIdentifier: args.schemaIdentifier,
  recordsSchema: args.recordsSchema,
  recordChangeability: args.recordChangeability,
  ownerType: args.ownerType,
  subjectIdentifiability: args.subjectIdentifiability,
  accuracy: args.accuracy !== null ? parseInt(args.accuracy, 10) : null,
  veracity: args.veracity !== null ? parseInt(args.veracity, 10) : null,
  sensitivity: args.sensitivity !== null ? parseInt(args.sensitivity, 10) : null,
  intrinsicRisk: args.intrinsicRisk !== null ? parseInt(args.intrinsicRisk, 10) : null,
  contextualRisk: args.contextualRisk !== null ? parseInt(args.contextualRisk, 10) : null,
  transactionData: {
    date: new Date().toISOString().split('T')[0],
    timestamp: Math.floor(Date.now() / 1000).toString()
  },
  entanglementData: `ipfs://${args.cid}`, // IPFS CID upload
  ownerIdentifier: args.did
};

// save metaQube JSON to a file
fs.writeFileSync('metaQube.json', JSON.stringify(metaQube, null, 2));
console.log('metaQube JSON file created:', metaQube);
