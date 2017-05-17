const express = require('express')
const router = express.Router()
const ProofOfEmail = global.artifacts.require('ProofOfEmail');
const Sentencer = require('../node_modules/sentencer');
const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);
const email = require('./email');
const moduleIndex = require('./module-index').index;

// ROUTING
router.get('/', function (req, res) {
  res.render('index', { title: 'Satellite', message: 'You can either verify or browse modules' })
})

router.get('/modules', function (req, res) {
  res.render('shop',
    { title: 'Modules', message: 'Browse modules', modules: moduleIndex })
})

router.get('/checkVerification', function (req, res) {
  res.render('checkVerification', {message: 'Enter address to verify'})
})

router.get('/verification', function (req, res) {
  res.render('verification', { title: 'Verification', message: 'Verify' })
})

router.get('/code', function (req, res) {
  res.render('enter-code', 
    {title: 'Verification', message: 'Enter the code we emailed you here'})
})

router.post('/verification', function (req, res) {
  // generate the code and token
  // send token to contract and send code to client
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
    var request = email.sendCodeEmail(req.body.email, code);
    sg.API(request, (err, response) => {
      if(!err)
        res.redirect('/code');
      else
        res.status(400).send('Failure sending mail');
    });
  })
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
  console.log(req.body.address);
  ProofOfEmail.deployed()
  .then(instance => instance.certified(req.body.address))
  .then(confirmed => {
    console.log(confirmed);
    if(confirmed)
      res.render('checkVerification', {message: 'Your address is verified!'})
    else
      res.render('checkVerification', {message: 'Your address is not verified.'})
  })
})

module.exports = () => router
