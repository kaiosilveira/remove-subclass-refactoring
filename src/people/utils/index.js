import { createPerson } from '../factory';

export function loadFromInput(data) {
  return data.map(aRecord => createPerson(aRecord));
}
