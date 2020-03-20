const validatePassword = password => {
  /* Password must contain at least 8 character,
      one digit,
      one lower case character
      one upper case character,
      one special character,
  */
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
  return pattern.test(password);
};

module.exports = validatePassword;
