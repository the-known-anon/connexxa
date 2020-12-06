'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://connexbot-sfb9-default-rtdb.firebaseio.com/'

});
admin.initializeApp();
const db = admin.firestore();
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
 
  function getBgHandler(agent) {
    const bg = agent.parameters.bg;
    const dialogflowAgentRef = db.collection('bg').doc('bg');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef, {entry: bg});
      return Promise.resolve('Write complete');
    }).then(doc => {
      bg.add(`Wrote "${bg}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      bg.add(`Failed to write "${bg}" to the Firestore database.`);
    });
  }
  
 function getSbpHandler(agent) {
    const Sbp = agent.parameters.Sbp;
    const dialogflowAgentRef1 = db.collection('Sbp').doc('Sbp');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef1, {entry: Sbp});
      return Promise.resolve('Write complete');
    }).then(doc => {
      Sbp.add(`Wrote "${Sbp}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      Sbp.add(`Failed to write "${Sbp}" to the Firestore database.`);
    });
  } 
 
   function getDbpHandler(agent) {
    const Dbp = agent.parameters.Dbp;
    const dialogflowAgentRef2 = db.collection('Dbp').doc('Dbp');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef2, {entry: Dbp});
      return Promise.resolve('Write complete');
    }).then(doc => {
      Dbp.add(`Wrote "${Dbp}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      Dbp.add(`Failed to write "${Dbp}" to the Firestore database.`);
    });
  } 
  
  
  let intentMap = new Map();
  intentMap.set('bgGET', getBgHandler);
  intentMap.set('systolicGET', getSbpHandler);
  intentMap.set('diastolicGET', getDbpHandler);
  agent.handleRequest(intentMap);
});
