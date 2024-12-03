import { Female } from '../female/index.js';
import { Male } from '../male/index.js';
import { Person } from '../person/index.js';

export function loadFromInput(data) {
  const result = [];
  data.forEach(aRecord => {
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
    return result.push(p);
  });
  return result;
}
