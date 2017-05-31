import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// SMART-CONTRACT IMPORT
const SATELLITE_ADDRESS = '0x28C40fE473a2d374ceeE67f99995E907F37c6cec';
import contract from 'truffle-contract';
import SatelliteJson from '/imports/lib/assets/contracts/Satellite.json';
const Satellite = contract(SatelliteJson); // Set Provider
Satellite.setProvider(web3.currentProvider);
const satelliteInstance = Satellite.at(SATELLITE_ADDRESS);

// COLLECTIONS & METHODS
export const Modules = new Mongo.Collection('modules');
if (Meteor.isServer) {
  console.log('Publishing collection from server');
  Meteor.publish('modules', () => Modules.find({}, { sort: { createdAt: -1 } }));
}

Modules.watch = () => {
  const registeredEvent = satelliteInstance.ModuleRegistered({}, {
    fromBlock: web3.eth.blockNumber,
    toBlock: 'latest'
  });

  registeredEvent.watch(Meteor.bindEnvironment((err, evnt) => {
    if (err) throw err;
    Modules.syncEntryByName(evnt.args.moduleName);
  }));
};


Modules.syncAll = () => { // can change `fromBlock` if this is slow
  satelliteInstance.ModuleRegistered({}, {fromBlock: 0, toBlock: 'latest'}).get((err, evntLog) => {
    if(err) throw err;
    else if(evntLog.length == 0) console.log('Nothing to sync.');
    else{
      for(let evnt of evntLog){
        Modules.syncEntryByName(evnt.args.moduleName);
      }
    }
  })
};


Modules.syncEntryByName = (name) => {
  satelliteInstance.showModule.call(name).then((info) => {
    let [owner, url, score, created] = info;
    Modules.upsert({
      name
    }, {
      name,
      owner,
      url,
      createdAt: created.toNumber()
    });
  });
};

// METEOR METHODS

Meteor.methods({
  'modules.syncAll': () => Modules.syncAll(),
  'modules.watch': () => Modules.watch()
});
