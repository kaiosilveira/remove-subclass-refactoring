import { createPerson } from '../factory';

export function loadFromInput(data) {
  const result = [];
  data.forEach(aRecord => {
    return result.push(createPerson(aRecord));
  });
  return result;
}
