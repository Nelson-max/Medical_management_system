const bcrypt = require('bcryptjs');

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);

module.exports = {
  hashPassword,
  verifyPassword
};
