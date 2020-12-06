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
    const blood_glucose = agent.parameters.blood_glucose;
    const dialogflowAgentRef = db.collection('blood_glucose').doc('blood_glucose');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef, {entry: blood_glucose});
      return Promise.resolve('Write complete');
    }).then(doc => {
      blood_glucose.add(`Wrote "${blood_glucose}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      blood_glucose.add(`Failed to write "${blood_glucose}" to the Firestore database.`);
    });
  }
  
 function getSbpHandler(agent) {
    const systolic_bp = agent.parameters.systolic_bp;
    const dialogflowAgentRef1 = db.collection('systolic_bp').doc('systolic_bp');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef1, {entry: systolic_bp});
      return Promise.resolve('Write complete');
    }).then(doc => {
      systolic_bp.add(`Wrote "${systolic_bp}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      systolic_bp.add(`Failed to write "${systolic_bp}" to the Firestore database.`);
    });
  } 
 
   function getDbpHandler(agent) {
    const diastolic_bp = agent.parameters.diastolic_bp;
    const dialogflowAgentRef2 = db.collection('diastolic_bp').doc('diastolic_bp');
	return db.runWrite(w => {
      w.set(dialogflowAgentRef2, {entry: diastolic_bp});
      return Promise.resolve('Write complete');
    }).then(doc => {
      diastolic_bp.add(`Wrote "${diastolic_bp}" to the Firestore database.`);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      diastolic_bp.add(`Failed to write "${diastolic_bp}" to the Firestore database.`);
    });
  } 
  
  
  let intentMap = new Map();
  intentMap.set('bgGET', getBgHandler);
  intentMap.set('systolicGET', getSbpHandler);
  intentMap.set('diastolicGET', getDbpHandler);
  agent.handleRequest(intentMap);
});
