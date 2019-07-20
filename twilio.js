//set up for the twilio api. 
//This api will be used to send sms messages, providing users with their code for two factor authentication.
const twilio = require('twilio');

const accountSid = 'AC92acd5ec2a489070e91deb0ff193cc79';
const authToken = '067e11d7bf2e1d1d55f25debe22cf270';
//Twilio purchased number - +441456256016
module.exports = new twilio(accountSid, authToken);