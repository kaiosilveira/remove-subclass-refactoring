import { Person } from '.';

describe('Person', () => {
  it('should have genderCode as X', () => {
    const person = new Person('Alex Doe');
    expect(person.genderCode).toBe('X');
  });
});
