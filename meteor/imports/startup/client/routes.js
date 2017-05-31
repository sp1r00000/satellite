import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

//Load templates
import '/imports/ui/pages/modules.js';

//const ProofOfEmail = global.artifacts.require('ProofOfEmail');
//const Sentencer = require('sentencer');
//const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// TODO: change rendering code (not using express any more)
// ROUTING

FlowRouter.route('/', {
  name: 'satellite',
  action() {
    BlazeLayout.render('modules');
  }
})

FlowRouter.route('/modules', {
  name: 'modules',
  action() {
    BlazeLayout.render('modules');
  }
})

//FlowRouter.route('/verification', {
//  name: 'verification',
//  action() {
//    BlazeLayout.render('verification');
//  }
//})

//TODO: replace POST methods with client-side logic
//router.post('/verification', function (req, res) {
//})
//
//router.post('/code', function (req, res) {
//  // generate the code and token
//  // send token to contract and send code to client
//  ProofOfEmail.deployed()
//  .then(instance => {
//    var token = web3.sha3(req.body.code);
//    return instance.confirm(token);
//  })
//  .then(() => res.redirect('/checkVerification'))
//})
//
//router.post('/checkVerification', function (req, res) {
//  ProofOfEmail.deployed()
//  .then(instance => instance.certified(req.body.address))
//  .then(confirmed => {
//    if(confirmed)
//      res.render('checkVerification', {message: 'Your address is verified!'})
//    else
//      res.render('checkVerification', {message: 'Your address is not verified.'})
//  })
//})
//
//module.exports = () => router
