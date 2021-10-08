const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
  static async signUp({ email, password }) {
    const existingUser = await User.findByEmail(email);
    console.log('THIS', existingUser);
    if (existingUser) {
      throw new Error('User exists, please try another email');
    }
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      email,
      passwordHash
    });
    return user;
  }

  static async login({ email, password }) {
    const existingUser = await User.findByEmail(email);
    console.log(existingUser);

    if (!existingUser) {
      throw new Error('Email/Password does not match');
    }
    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );


    if (!passwordsMatch) {
      throw new Error('Email/Password does not match');
    }
    return existingUser;
  }
};
