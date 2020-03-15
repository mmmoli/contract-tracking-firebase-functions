import * as dgraph from "dgraph-js";
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

interface IContactWithResult {
  personId: string;
  date: Date;
  contact_withs: string[];
}

const queryContactWith = async ({ inputVars, client }: IContactWith) => {
  const { date, personId } = inputVars;
  const dateString = dateFormat(date);

  const vars = {
    $personDayId: `${personId}_${dateString}`
  };

  const query = gql`
    query ContactWith($personDayId: string) {    
      contact_on_day(func: eq(PersonDay.id, $personDayId)) @normalize {    
        PersonDay.contact_withs {
          Contact.person_days @filter(not(eq(PersonDay.id, $personDayId))) {
            contact: PersonDay.id
          }
        }
      }    
    }
  `;
  const res = await client.newTxn().queryWithVars(query, vars);
  const contacts = res.getJson().contact_on_day;

  const contact_withs = contacts.map(
    (node: { contact: string }) => node.contact
  );

  const result: IContactWithResult = {
    personId,
    date,
    contact_withs
  };

  return result;
};

export default queryContactWith;
