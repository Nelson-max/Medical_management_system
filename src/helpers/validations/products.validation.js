const joi = require('joi').extend(require('@joi/date'));

function productValidation(body) {
  const userSchema = joi.object({
    medicineName: joi.string().required(),
    genericName: joi.string().required(),
    code: joi.string().required(),
    category: joi.string(),
    description: joi.string(),
    manufacturer: joi.string(),
    purchasePrice: joi.number().required(),
    salePrice: joi.number().required(),
    mfdate: joi.date().required(),
    expdate: joi.date().required(),
    stock: joi.number()
  });
  return userSchema.validate(body);
}
module.exports = productValidation;
