import * as functions from 'firebase-functions';
import { GraphQLClient } from 'graphql-request';

const gql = String.raw;

// ********************************************************* //

const endpoint = functions.config().graph.endpoint;
const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${functions.config().graph.token}`
  }
});

// ********************************************************* //

interface createKnows {
  fromUid: string;
  toUid: string;
}
interface createKnowsPayload {
  data: {
    from: {
      uid: string;
    };
  };
}

export const createKnows = functions
  .region('europe-west1')
  .https.onCall((data: createKnows) => {
    const query = gql`
      mutation createKnows($fromUid: ID!, $toUid: ID!) {
        AddPersonConnections(from: { uid: $fromUid }, to: { uid: $toUid }) {
          from {
            uid
          }
        }
      }
    `;

    return client
      .request<createKnowsPayload>(query, data)
      .then(({ data: { from: uid } }) => uid);
  });

// ********************************************************* //

interface registerUserPayload {
  data: {
    newPerson: {
      uid: String;
    };
  };
}

interface registerUserWithGraph {
  uid: string;
}

export const registerUserWithGraph = (payload: registerUserWithGraph) => {
  const query = gql`
    mutation createPerson($uid: ID!) {
      newPerson: CreatePerson(input: { uid: $uid }) {
        uid
      }
    }
  `;

  return client
    .request<registerUserPayload>(query, payload)
    .then(({ data: { newPerson: uid } }) => uid);
};

// ********************************************************* //

interface logContactVariables {
  input: {
    fromUid: String;
    toUid: String;
    yyyy: String;
    mm: String;
    dd: String;
  };
}

interface logContact {
  fromUid: String;
  toUid: String;
  date: Date;
}

interface logContactPayload {
  data: {
    LogContact: {
      id: String;
      date: {
        formatted: String;
      };
      contactWith: [
        {
          uid: String;
        }
      ];
    };
  };
}

export const logContact = functions
  .region('europe-west1')
  .https.onCall((data: logContact) => {
    const query = gql`
      mutation logContact($input: LogContactInput!) {
        LogContact(input: $input) {
          id
          date {
            formatted
          }
          contactWith {
            uid
          }
        }
      }
    `;

    const { date, fromUid, toUid } = data;
    const variables: logContactVariables = {
      input: {
        fromUid,
        toUid,
        yyyy: `${date.getFullYear()}`,
        // https://stackoverflow.com/a/3605248
        mm: `${('0' + (date.getMonth() + 1)).slice(-2)}`,
        dd: `${('0' + date.getDate()).slice(-2)}`
      }
    };

    return client
      .request<logContactPayload>(query, variables)
      .then(({ data: { LogContact } }) => LogContact);
  });

interface unlogContactPayload {
  data: {
    UnlogContact: {
      id: String;
      date: {
        formatted: String;
      };
    };
  };
}

export const unlogContact = functions
  .region('europe-west1')
  .https.onCall((data: logContact) => {
    const query = gql`
      mutation unlogContact($input: LogContactInput!) {
        UnlogContact(input: $input) {
          id
          date {
            formatted
          }
        }
      }
    `;

    const { date, fromUid, toUid } = data;
    const variables: logContactVariables = {
      input: {
        fromUid,
        toUid,
        yyyy: `${date.getFullYear()}`,
        // https://stackoverflow.com/a/3605248
        mm: `${('0' + (date.getMonth() + 1)).slice(-2)}`,
        dd: `${('0' + date.getDate()).slice(-2)}`
      }
    };

    return client
      .request<unlogContactPayload>(query, variables)
      .then(({ data: { UnlogContact } }) => UnlogContact);
  });
