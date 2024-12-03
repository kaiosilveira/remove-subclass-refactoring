import { Female } from '.';

describe('Female', () => {
  it('should have genderCode as F', () => {
    const female = new Female('Jane Doe');
    expect(female.genderCode).toBe('F');
  });
});
