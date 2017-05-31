const TestRPC = require('ethereumjs-testrpc');

module.exports = {
  networks: {
    development: {
      network_id: '*', // Match any network id
      provider: new TestRPC.provider()
    },
    binary: {
      network_id: '*',
      host: 'localhost',
      port: 8545
    },
    kovan: {
      network_id: '42',
      gas: 3000000,
      host: 'localhost',
      port: 8545,
      from: '0x00E0B33cDb3AF8B55CD8467d6d13BC0Ba8035acF'
    }
  },
  mocha: {
    slow: 3000,
    reporter: 'spec'
  }
};
