const debug = require('debug')('log');
const Product = require('../models/product.model');
// const { hashPassword } = require('../helpers/hashpassword.helper');
const productSeed = require('./product.seed.json');

const seedProduct = async productData => {
  try {
    const { medicineName, genericName, code } = productData;

    const isExists = await Product.findOne({
      $or: [
        { medicineName: medicineName },
        { code: code },
        { genericName: genericName }
      ]
    });

    if (!isExists) {
      // const hashedPassword = await hashPassword(password);

      // const admin = {
      //   medicineName,
      //   genericName,
      //   code,
      //   username,
      //   phoneNumber,
      //   isVerified: true,
      //   isActivated: true,
      //   emailVerified: true,
      //   phoneVerified: true,
      //   password: hashedPassword
      // };

      Product.create(productData, e => {
        if (e) {
          throw e;
        }
      });

      debug('Product Added Successfully');
    }
  } catch (erro) {
    debug(erro.message);
  }
};

seedProduct(productSeed);
