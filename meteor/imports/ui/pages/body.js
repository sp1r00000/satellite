import { Template } from 'meteor/templating';
import { Modules } from '/imports/api/modules.js';
import './body.html';
 
Template.body.onCreated(() => {
  Meteor.subscribe('modules');
});

Template.body.helpers({
  moduleIndex() {
    return Modules.find({});
  },
});
