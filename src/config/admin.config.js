const debug = require('debug')('log');
const User = require('../models/user.model');
const { hashPassword } = require('../helpers/hashpassword.helper');

const seedAdmin = async adminData => {
  try {
    const { name, email, role, username, phoneNumber, password } = adminData;

    const isExists = await User.findOne({
      $or: [
        { email: email },
        { username: username },
        { phoneNumber: phoneNumber }
      ]
    });

    if (!isExists) {
      const hashedPassword = await hashPassword(password);

      const admin = {
        name,
        email,
        role,
        username,
        phoneNumber,
        isVerified: true,
        isActivated: true,
        emailVerified: true,
        phoneVerified: true,
        password: hashedPassword
      };

      User.create(admin, e => {
        if (e) {
          throw e;
        }
      });

      debug('Admin Registered Successfully');
    }
  } catch (erro) {
    debug(erro.message);
  }
};

const superAdmin = {
  name: 'Super Admin User',
  email: 'superadmin@gmail.com',
  username: 'superadmin',
  password: 'Superadmin.123',
  role: 'superAdmin',
  phoneNumber: '+250-79-000-0000'
};
const admin = {
  name: 'Admin User',
  email: 'admin@gmail.com',
  username: 'admin',
  password: 'Admin.123',
  role: 'admin',
  phoneNumber: '+250-78-000-0000'
};
const manager = {
  name: 'Manager User',
  email: 'manager@gmail.com',
  username: 'manager',
  password: 'Manager.123',
  role: 'manager',
  phoneNumber: '+250-79-123-0000'
};
const user = {
  name: 'Simple User',
  email: 'user@gmail.com',
  username: 'user',
  password: 'User.123',
  role: 'user',
  phoneNumber: '+250-78-123-0000'
};

seedAdmin(superAdmin);
seedAdmin(admin);
seedAdmin(manager);
seedAdmin(user);
