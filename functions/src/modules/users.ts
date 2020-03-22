import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { registerUserWithGraph } from './graph';

const db = admin.firestore();

export const setupNewUser = functions.auth.user().onCreate(async user => {
  const { uid, displayName, photoURL, email } = user;

  const profile = {
    displayName,
    photoURL,
    email,
    preferences: {
      contact_via_email: true,
      contact_via_phone: true
    }
  };

  await db
    .collection('profiles')
    .doc(uid)
    .set(profile);

  const resp = await registerUserWithGraph({ uid });

  return resp;
});
