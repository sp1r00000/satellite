const contract = require('truffle-contract');
const satelliteArtifacts = require('../build/contracts/Satellite.json');
const proofOfEmailArtifacts = require('../build/contracts/ProofOfEmail.json');

let accounts;
let Satellite = contract(satelliteArtifacts);
let ProofOfEmail = contract(proofOfEmailArtifacts);

window.App = {
  start: function() {
    var self = this;

    Satellite.setProvider(web3.currentProvider);
    ProofOfEmail.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      console.log('Got accounts');
      accounts = accs;
    });
  },

  submitCode: function() {
    var code = document.getElementById('code').value;
    console.log(`Submitting code "${code}"`);
    var token = web3.sha3(code);
    console.log(`Submitting token "${token}"`);
    ProofOfEmail.deployed()
    .then(instance => instance.confirm(token, {from: accounts[0]}))
    .then(res => {
      console.log('Transaction sent');
      if(res.logs.length > 0) {
        if(res.logs[0].event == 'Confirmed')
          console.log("Congratulations, you're verified!");
      }
    });
  }
}

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    console.warn("Using web3 detected from external source.")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
