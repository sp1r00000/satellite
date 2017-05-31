import { Template } from 'meteor/templating';
import { Modules } from '/imports/api/modules.js';
import './modules.html';
 
Template.modules.onCreated(() => {
  Meteor.subscribe('modules');
});

Template.modules.helpers({
  moduleIndex() {
    return Modules.find({});
  },
});
