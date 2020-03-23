const capitalizeFirstLetter = require('../../src/services/capitalizeFirstLetter');

describe('capitalizeFirstLetter function', () => {
  it('it should return the string with capitalize first letter of each word in capital letters', () => {
    expect(capitalizeFirstLetter('cat')).toEqual('Cat');
  });
});
