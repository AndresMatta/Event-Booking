const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      const isEmailNotUnique = await User.findOne({
        email: userInput.email
      });
      if (isEmailNotUnique) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        email: userInput.email,
        password: hashedPassword
      });
      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    const error = new Error("Invalid credentials");

    if (!user) throw error;

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) throw error;

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h"
      }
    );

    return { userId: user.id, token, tokenExpiration: 1 };
  }
};
