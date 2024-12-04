import { isMale } from '.';
import { createPerson } from './people/factory';

describe('isMale', () => {
  it('should return true if person is male', () => {
    const person = createPerson({ name: 'John Doe', gender: 'M' });
    expect(isMale(person)).toBe(true);
  });

  it('should return false if person is female', () => {
    const person = createPerson({ name: 'Jane Doe', gender: 'F' });
    expect(isMale(person)).toBe(false);
  });
});
