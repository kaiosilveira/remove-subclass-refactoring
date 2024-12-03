import { Person } from '../person/index.js';

export class Female extends Person {
  get genderCode() {
    return 'F';
  }
}
