const joi = require('joi');

function user(body) {
  const userSchema = joi.object({
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required().email({ minDomainSegments: 2 }),
    phoneNumber: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
  });
  return userSchema.validate(body);
}

module.exports = user;
