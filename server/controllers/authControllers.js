const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    //1. Extract email and password from request body
    const { firstName, lastName, email, password, profilePic } = req.body;

    //2. If the user already exists
    const existingUser = await User.findOne({ email });

    //3. If user exists, send an error response
    if (existingUser) {
      return res.send({
        message: "User already exists.",
        success: false,
      });
    }

    //4. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //5. Create new user, save in DB
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic,
    });

    //6. Save user in DB
    await newUser.save();

    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. Extract email and password from request body
    const { email, password } = req.body;

    // 2. Check if the user exists in the database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send({
        message: "User not found.",
        success: false,
      });
    }

    // 3. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({
        message: "Invalid credentials.",
        success: false,
      });
    }

    // 4. If the user exists & password is correct, assign a JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // 5. Send a successful response with user data (excluding password)
    res.status(200).send({
      message: "Login successful.",
      success: true,
      // user: {
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      //   profilePic: user.profilePic,
      // },
      token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};
