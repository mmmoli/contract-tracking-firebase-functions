import * as admin from "firebase-admin";

interface IsetupProfile {
  user: admin.auth.UserRecord;
  db: FirebaseFirestore.Firestore;
}
const setupProfile = (input: IsetupProfile) => {
  const {
    db,
    user: { uid, displayName, photoURL, email }
  } = input;

  const profile = {
    displayName,
    photoURL,
    email
  };

  return db
    .collection("profiles")
    .doc(uid)
    .set(profile);
};
export default setupProfile;
