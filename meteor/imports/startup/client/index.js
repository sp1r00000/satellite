// Initialize web3 as global object for entire client side
import web3 from '/imports/lib/client/web3.js';
// Load routes
import '/imports/startup/client/routes.js';
// Load API TODO: security vulnerability?
import '/imports/api/email-verification.js';
