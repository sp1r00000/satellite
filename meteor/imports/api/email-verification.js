const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;
const sentencer = require('sentencer');

const PROOF_OF_EMAIL_ADDRESS = '0x79F39D4F15366F5CE2856F1730350aF9c44a7dC5';
import contract from 'truffle-contract';
import ProofOfEmailJson from '/imports/lib/assets/contracts/ProofOfEmail.json';
const ProofOfEmail = contract(ProofOfEmailJson); // Set Provider
ProofOfEmail.setProvider(web3.currentProvider);
const emailContractInstance = ProofOfEmail.at(PROOF_OF_EMAIL_ADDRESS);

// EMAIL API
function sendCodeEmail (email, code) {
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

// HANDLER
// generate the code and token
// send token to contract and send code to client
function onVerificationRequest () {
  var code = Sentencer.make('{{ adjective }} {{ adjective }} {{ nouns }}');
  ProofOfEmail.deployed()
  .then(instance => {
    var token = web3.sha3(code);
    return instance.puzzle(
      req.body.address, web3.sha3(token, {encoding: 'hex'}),
      web3.sha3(req.body.email)
    );
  })
  .then(() => {
    var request = sendCodeEmail(req.body.email, code);
    sg.API(request, (err, response) => {
      if(!err)
        res.redirect('/code');
      else
        res.status(400).send('Failure sending mail');
    });
  })
}
