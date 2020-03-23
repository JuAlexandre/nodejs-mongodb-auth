const validatePassword = require('../../src/services/validatePassword');

describe('capitalizeFirstLetter function', () => {
  it('it should return true', () => {
    expect(validatePassword('P@ssw0rd')).toEqual(true);
  });

  it('it should return false', () => {
    expect(validatePassword('password')).toEqual(false);
  });
});
