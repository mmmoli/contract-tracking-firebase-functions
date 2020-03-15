import * as dgraph from "dgraph-js-http";
import dateFormat from "./helpers/dateFormat";
const gql = String.raw;

interface ContactWithVars {
  date: Date;
  personId: string;
}

interface IContactWith {
  inputVars: ContactWithVars;
  client: dgraph.DgraphClient;
}

interface Response {
  data: {
    contact_with: {
      contact: string;
    }[];
  };
  extensions: dgraph.Extensions;
}

interface IContactWithResult {
  personId: string;
  date: string;
  contact_withs: string[];
}

const queryContactWith = async ({ inputVars, client }: IContactWith) => {
  const { date, personId } = inputVars;
  const dateString = dateFormat(date);
  const personDayId = `${personId}_${dateString}`;

  const vars = {
    $personDayId: personDayId
  };

  const query = gql`
    query ContactWith($personDayId: string) {    
      contact_with(func: eq(PersonDay.id, $personDayId)) @normalize {    
        PersonDay.contact_withs {
          Contact.person_days @filter(not(eq(PersonDay.id, $personDayId))) {
            contact: PersonDay.id
          }
        }
      }    
    }
  `;
  const options = { readOnly: true, bestEffort: true };
  const res = (await client
    .newTxn(options)
    .queryWithVars(query, vars)) as Response;
  const { contact_with } = res.data;

  const people = contact_with.map(node => node.contact);

  const result: IContactWithResult = {
    personId,
    date: date.toISOString(),
    contact_withs: people
  };

  return result;
};

export default queryContactWith;
