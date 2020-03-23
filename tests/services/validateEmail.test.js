const validateEmail = require('../../src/services/validateEmail');

describe('capitalizeFirstLetter function', () => {
  it('it should return true', () => {
    expect(validateEmail('julien.alexandre16@gmail.com')).toEqual(true);
  });

  it('it should return false', () => {
    expect(validateEmail('julien.alexandre16gmail.com')).toEqual(false);
  });
});
