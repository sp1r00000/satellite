import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

txDefaults = {
  from: '0x00E0B33cDb3AF8B55CD8467d6d13BC0Ba8035acF',
  gas: 4000000
}

// VERIFICATION MODULES IMPORT
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;
const sentencer = require('sentencer');

const PROOF_OF_EMAIL_ADDRESS = '0x79F39D4F15366F5CE2856F1730350aF9c44a7dC5';
import contract from 'truffle-contract';
import ProofOfEmailJson from '/imports/lib/assets/contracts/ProofOfEmail.json';
const ProofOfEmail = contract(ProofOfEmailJson); // Set Provider
ProofOfEmail.setProvider(web3.currentProvider);
ProofOfEmail.defaults(txDefaults);
const poeInstance = ProofOfEmail.at(PROOF_OF_EMAIL_ADDRESS);

export const Verification = new Mongo.Collection('verification');
if (Meteor.isServer) {
  Meteor.publish('verification', () => Modules.find({}, { sort: { createdAt: -1 } }));
}

Verification.watch = () => {
  const requestedEvent = poeInstance.Requested({}, {
    fromBlock: web3.eth.blockNumber,
    toBlock: 'latest'
  });

  requestedEvent.watch(Meteor.bindEnvironment((err, evnt) => {
    if (err) throw err;
  }));
};

// EMAIL API
function sendCodeToEmail (code, email) {
  var from_email = new helper.Email('verify@melonport.com');
  var to_email = new helper.Email(email);
  var subject = 'Melonport Verification Request';
  var content = new helper.Content('text/plain',
    `Please enter this code at the contract:  ${code}`
  );
  var mail = new helper.Mail(from_email, subject, to_email, content);

  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

Verification.submitCode = (code) => {
  console.log(`Submitting code ${code}`);
  var token = web3.sha3(code);
  return poeInstance.confirm(token, {from: window.web3.eth.accounts[0]});
}

if(Meteor.isServer){
  Meteor.methods({
    'email.onVerificationRequest': (email, account) => {
      // generate the code and token
      // send token to contract and send code to client
      var code = sentencer.make('{{ adjective }}_{{ adjective }}_{{ nouns }}');
      var token = web3.sha3(code);
      poeInstance.puzzle(
        account, web3.sha3(token, {encoding: 'hex'}),
        web3.sha3(email)
      )
      .then(() => {
        console.log(`About to send email to ${email} regarding account ${account}`);
        var request = sendCodeToEmail(code, email);
        sg.API(request, (err, response) => {
          if(!err) {
            //display form to enter emailed code
            return true;
          }else{
            //show error message
            console.error(err);
            throw err;
          }
        });
      })
      .catch(err => console.error(err))
    }
  })
}
