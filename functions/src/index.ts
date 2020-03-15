import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as dgraph from "dgraph-js-http";
import queryContactWith from "./queryContact";
import setupProfile from "./setupProfile";

admin.initializeApp();
const db = admin.firestore();
const clientStub = new dgraph.DgraphClientStub(
  functions.config().dbgraph.ip,
  false
);
const client = new dgraph.DgraphClient(clientStub);

export const contactWith = functions
  .region("europe-west1")
  .https.onCall((data: { date: string; personId: string }) => {
    const { date: dateStr, personId } = data;
    return queryContactWith({
      inputVars: {
        date: new Date(dateStr),
        personId
      },
      client
    });
  });

export const setupNewUser = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(user => setupProfile({ user, db }));
