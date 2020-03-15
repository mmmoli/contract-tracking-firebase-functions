import * as functions from "firebase-functions";
import * as dgraph from "dgraph-js";
import * as grpc from "grpc";
import queryContactWith from "./queryContact";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const clientStub = new dgraph.DgraphClientStub(
  "localhost:9080",
  grpc.credentials.createInsecure()
);

const client = new dgraph.DgraphClient(clientStub);

export const addMessage = functions.https.onCall(() => {
  return queryContactWith({
    inputVars: {
      date: new Date(),
      personId: "J7SWXElLc2hh3tpPACQfkNZv9r53"
    },
    client
  });
});
