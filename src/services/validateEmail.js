const validateEmail = email => {
    const pattern = /\S+@\S+\.\S+/;
    return pattern.test(email);
};

module.exports = validateEmail;
