// Get our Web3 instance
import web3 from '/imports/lib/server/web3.js';
// Define collections and methods for client
import '/imports/startup/server/register-apis.js';
// Sync collections according to blockchain state
import '/imports/startup/server/sync-collections.js';
