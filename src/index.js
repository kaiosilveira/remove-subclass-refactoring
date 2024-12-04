import { loadFromInput } from './people/utils/index.js';

const people = loadFromInput([
  { name: 'Alex Doe' },
  { name: 'John Doe', gender: 'M' },
  { name: 'Jane Doe', gender: 'F' },
]);

const numberOfMales = people.filter(p => p.isMale).length;

console.log(`Number of males: ${numberOfMales}`);
