import { createPerson } from '.';

describe('createPerson', () => {
  it('should load a person of unknown gender from input', () => {
    const person = createPerson({ name: 'Alex Doe' });
    expect(person.name).toBe('Alex Doe');
    expect(person.genderCode).toBe('X');
  });

  it('should load a male from input', () => {
    const male = createPerson({ name: 'John Doe', gender: 'M' });
    expect(male.name).toBe('John Doe');
    expect(male.genderCode).toBe('M');
  });

  it('should load a female from input', () => {
    const female = createPerson({ name: 'Jane Doe', gender: 'F' });
    expect(female.name).toBe('Jane Doe');
    expect(female.genderCode).toBe('F');
  });
});
