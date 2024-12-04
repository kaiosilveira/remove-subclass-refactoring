import { Male } from './people/male/index.js';
import { loadFromInput } from './people/utils/index.js';

const people = loadFromInput([
  { name: 'Alex Doe' },
  { name: 'John Doe', gender: 'M' },
  { name: 'Jane Doe', gender: 'F' },
]);

const numberOfMales = people.filter(p => p instanceof Male).length;

console.log(`Number of males: ${numberOfMales}`);

export function isMale(person) {
  return person instanceof Male;
}
