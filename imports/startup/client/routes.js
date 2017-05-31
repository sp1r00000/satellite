import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

const ProofOfEmail = global.artifacts.require('ProofOfEmail');
const Sentencer = require('../node_modules/sentencer');
const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);

// TODO: change rendering code (not using express any more)
// ROUTING
FlowRouter.route('/', function (req, res) {
  res.render('index', { title: 'Satellite', message: 'You can either verify or browse modules' })
})

FlowRouter.route('/modules', function (req, res) {
  res.render('shop',
    { title: 'Modules', message: 'Browse modules', modules: moduleIndex })
})

FlowRouter.route('/checkVerification', function (req, res) {
  res.render('checkVerification', {message: 'Enter address to verify'})
})

FlowRouter.route('/verification', function (req, res) {
  res.render('verification', { title: 'Verification', message: 'Verify' })
})

FlowRouter.route('/code', function (req, res) {
  res.render('enter-code', 
    {title: 'Verification', message: 'Enter the code we emailed you here'})
})

//TODO: replace POST methods with client-side logic
router.post('/verification', function (req, res) {
})

router.post('/code', function (req, res) {
  // generate the code and token
  // send token to contract and send code to client
  ProofOfEmail.deployed()
  .then(instance => {
    var token = web3.sha3(req.body.code);
    return instance.confirm(token);
  })
  .then(() => res.redirect('/checkVerification'))
})

router.post('/checkVerification', function (req, res) {
  ProofOfEmail.deployed()
  .then(instance => instance.certified(req.body.address))
  .then(confirmed => {
    if(confirmed)
      res.render('checkVerification', {message: 'Your address is verified!'})
    else
      res.render('checkVerification', {message: 'Your address is not verified.'})
  })
})

module.exports = () => router
