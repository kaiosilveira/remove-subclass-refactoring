import { Female } from '../female';
import { Male } from '../male';
import { Person } from '../person';

export function createPerson(aRecord) {
  let p;
  switch (aRecord.gender) {
    case 'M':
      p = new Male(aRecord.name);
      break;
    case 'F':
      p = new Female(aRecord.name);
      break;
    default:
      p = new Person(aRecord.name);
      break;
  }
  return p;
}
