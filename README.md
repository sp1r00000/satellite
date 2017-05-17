<img align="right" src="https://git.io/vSDJZ">

# Melon Satellite [![Build Status](https://travis-ci.org/melonproject/satellite.svg?branch=master)](https://travis-ci.org/melonproject/satellite) ![Dependencies](https://david-dm.org/melonproject/satellite.svg)

A permissionless registry for publishing and 
voting on community Melon modules.

## Getting Started

Install dependencies with `npm install`

Run tests with `npm test`

### Run on local TestRPC

Make sure you have an RPC client running (e.g. `testrpc`), then start the server with `npm run local`

### Run on Kovan Testnet

Have your parity client running in the background on port 8547, then start server with `npm run kovan`

## Sample Functionality

```js
//user creates a new registry entry with name
//and URL to the homepage of their module
registerModule('my-cool-module', 'melon.io/my-cool-module')

//user can vote on others' modules (but not their own)
voteOnModule('great-module', true)          //upvote
voteOnModule('not-so-great-module', false)  //downvote

//module creator can remove module from the registry
removeModule('my-cool-module')
```
