import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { registerUserWithGraph } from './graph';

const db = admin.firestore();

export const setupNewUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async user => {
    const { uid, displayName, photoURL, email } = user;

    const profile = {
      displayName,
      photoURL,
      email
    };

    await db
      .collection('profiles')
      .doc(uid)
      .set(profile);

    return registerUserWithGraph({ uid });
  });
