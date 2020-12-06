'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

//connect to database
const admin = require('firebase-admin');
admin.initializeApp();
admin.initializeApp({
 credential: admin.credential.applicationDefault(),
 databaseURL: 'https://connexbot-sfb9-default-rtdb.firebaseio.com/', 
});
 
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
 
  function getBgHandler(agent) {
    let bg = agent.parameters.name;
    agent.add(`Your blood glucose level is ${bg}`);
  }
  
 function getSbpHandler(agent) {
    let Sbp = agent.parameters.name;
    agent.add(`Your systolic blood pressure is ${Sbp}`);
  }
 
  
  function getDbpHandler(agent) {
    let Dbp = agent.parameters.name;
    agent.add(`Your diastolic blood pressure is ${Dbp}`);
  }
  
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('bgGET', getBgHandler);
  intentMap.set('systolicGET', getSbpHandler);
  intentMap.set('diastolicGET', getDbpHandler);
  intentMap.set('fallback', fallback);
  agent.handleRequest(intentMap);
});
