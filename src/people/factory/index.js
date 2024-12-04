import { Female } from '../female';
import { Person } from '../person';

export function createPerson(aRecord) {
  switch (aRecord.gender) {
    case 'M':
      return new Person(aRecord.name, 'M');
    case 'F':
      return new Female(aRecord.name);
    default:
      return new Person(aRecord.name);
  }
}
