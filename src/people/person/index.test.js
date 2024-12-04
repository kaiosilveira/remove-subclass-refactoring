import { Person } from '.';

describe('Person', () => {
  it('should have genderCode as F', () => {
    const person = new Person('Alex Doe', 'X');
    expect(person.genderCode).toBe('X');
  });
});
