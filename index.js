'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://connexbot-sfb9-default-rtdb.firebaseio.com/',
});
admin.initializeApp();
const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
 
  function getBgHandler(agent) {
    let bg = agent.parameters.name || agent.context.get('Starthealthcheck-followup').parameters.name;
    db.collection('bg').add({ bg: bg });
    agent.add(`Your blood glucose level is ${bg}`);
  }
  
 function getSbpHandler(agent) {
    let Sbp = agent.parameters.name || agent.context.get('Starthealthcheck-custom-followup').parameters.name; 
   	db.collection('Sbp').add({ Sbp: Sbp });
    agent.add(`Your systolic blood pressure is ${Sbp}`);
  }
 
  
  function getDbpHandler(agent) {
    let Dbp = agent.parameters.name || agent.context.get('Starthealthcheck-custom-custom-followup').parameters.name; 
    db.collection('Dbp').add({ Dbp: Dbp });
    agent.add(`Your diastolic blood pressure is ${Dbp}`);
  }
  
  let intentMap = new Map();
  intentMap.set('bgGET', getBgHandler);
  intentMap.set('systolicGET', getSbpHandler);
  intentMap.set('diastolicGET', getDbpHandler);
  agent.handleRequest(intentMap);
});