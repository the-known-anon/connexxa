"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "ws://connexbot-sfb9-default-rtdb.firebaseio.com/"
});
admin.initializeApp();
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    function skip(agent) {
      agent.add(
        `No worries, you can get back to me later when you have the values:) See you!`
      );
    }

    function bye(agent) {
      agent.add(`Goodbye!`);
    }

    function getBgHandler(agent) {
      const blood_glucose = agent.parameters.blood_glucose;
      return admin
        .database()
        .ref("data1")
        .set({
          blood_glucose: "100"
        });
    }

    function getSbpHandler(agent) {
      const systolic_bp = agent.parameters.systolic_bp;
      return admin
        .database()
        .ref("data2")
        .set({
          systolic_bp: "120"
        });
    }
    function getDbpHandler(agent) {
      const diastolic_bp = agent.parameters.diastolic_bp;
      return admin
        .database()
        .ref("data3")
        .set({
          diastolic_bp: "80"
        });
    }
    let intentMap = new Map();
    intentMap.set("Welcome", welcome);
    intentMap.set("bgGET", getBgHandler);
    intentMap.set("systolicGET", getSbpHandler);
    intentMap.set("diastolicGET", getDbpHandler);
    intentMap.set("fallback", fallback);
    intentMap.set("bye", bye);
    intentMap.set("skip", skip);
    agent.handleRequest(intentMap);
  }
);
