import { loadFromInput } from '.';

describe('loadFromInput', () => {
  it('should load a person of unknown gender from input', () => {
    const data = [{ name: 'Alex Doe' }];

    const [person] = loadFromInput(data);

    expect(person.name).toBe('Alex Doe');
    expect(person.genderCode).toBe('X');
  });

  it('should load a male from input', () => {
    const data = [{ name: 'John Doe', gender: 'M' }];

    const [male] = loadFromInput(data);

    expect(male.name).toBe('John Doe');
    expect(male.genderCode).toBe('M');
  });

  it('should load a female from input', () => {
    const data = [{ name: 'Jane Doe', gender: 'F' }];

    const [female] = loadFromInput(data);

    expect(female.name).toBe('Jane Doe');
    expect(female.genderCode).toBe('F');
  });
});
