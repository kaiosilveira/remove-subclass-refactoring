import { Female } from '../female/index.js';
import { Male } from '../male/index.js';
import { Person } from '../person/index.js';

export function loadFromInput(data) {
  const result = [];
  data.forEach(aRecord => {
    return result.push(createPerson(aRecord));
  });
  return result;
}
