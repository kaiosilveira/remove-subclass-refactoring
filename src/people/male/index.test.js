import { Male } from '.';

describe('Male', () => {
  it('should have genderCode as M', () => {
    const male = new Male('John Doe');
    expect(male.genderCode).toBe('M');
  });
});
