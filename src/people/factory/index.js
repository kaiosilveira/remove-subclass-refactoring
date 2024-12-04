import { Female } from '../female';
import { Male } from '../male';
import { Person } from '../person';

export function createPerson(aRecord) {
  switch (aRecord.gender) {
    case 'M':
      return new Male(aRecord.name);
    case 'F':
      return new Female(aRecord.name);
    default:
      return new Person(aRecord.name);
  }
}
