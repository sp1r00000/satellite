import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

//Load templates
import '/imports/ui/pages/modules.js';
import '/imports/ui/pages/verification.js';

//Load API method
import { Verification } from '/imports/api/email-verification.js';

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

FlowRouter.route('/verification', {
  name: 'verification',
  action() {
    BlazeLayout.render('verification');
  }
})

FlowRouter.route('/verification/:code', {
  name: 'code',
  action(params) {
    Verification.submitCode(params.code)
    .then(() => FlowRouter.go('/'))
  }
})

