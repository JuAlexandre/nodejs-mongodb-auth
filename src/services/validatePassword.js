const validatePassword = password => {
  /* Password must contain at least 8 character,
      one digit,
      one special character,
      one upper case character,
      one lower case character
  */
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
  return pattern.test(password);
};

module.exports = validatePassword;
