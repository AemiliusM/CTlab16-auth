const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
  static async signUp({ email, password }) {
    const existingUser = await User.findByEmail(email);
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
};
