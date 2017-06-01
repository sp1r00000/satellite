import { Template } from 'meteor/templating';
import { Verification } from '/imports/api/email-verification.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './verification.html';
 
Template.verification.events({
  'submit .request-verification'(event) {
    event.preventDefault();

    const target = event.target;
    const email = target.email.value;
    const account = target.account.value;
    Meteor.call('email.onVerificationRequest', email, account, (err, res) => {
      if(err) console.error(err);
      if(res == true){
        FlowRouter.go('/code');
      }
    });
  }
});
