// Remark: Code mostly taken from: https://github.com/melonproject/portal
import { Meteor } from 'meteor/meteor';

// Collections
import { Modules } from '/imports/api/modules';

// EXECUTION
Meteor.startup(() => {
  Modules.remove({});
  console.log('Syncing module index');
  Modules.syncAll();
  console.log('Done initial sync');
  Modules.watch();
  console.log('Watching for changes to module index');
});
