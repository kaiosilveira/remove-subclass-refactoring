import { Male } from '../male';

export class Person {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get genderCode() {
    return 'X';
  }

  get isMale() {
    return this instanceof Male;
  }
}
