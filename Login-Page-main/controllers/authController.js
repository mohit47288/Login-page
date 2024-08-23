const bcrypt = require('bcryptjs');
const User = require('../models/User');

const validatePassword = (password) => {
  const regex = /^[A-Z]/; // Password must start with a capital letter
  return regex.test(password) && password.length == 6;
};

exports.loginOrRegister = async (req, res) => {
  const { loginUser, password } = req.body;

  if (!validatePassword(password)) {
    return res.json({
      sucess: true,
      message: "Error connecting to the database."
  });
}

  try {
    const foundUser = await User.findOne({ username: loginUser });

    if (foundUser) {
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (isMatch) {
        return res.render('userTable', { user: foundUser });
      } else {
        return res.json({
          sucess: false,
          message: "Error connecting to the database."
      });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username: loginUser, password: hashedPassword });
      await newUser.save();
      return res.render('userTable', { user: newUser });
    }
  } catch (err) {
    return res.json({
        sucess: false,
        message: "Error connecting to the database."
    });
  }
};
