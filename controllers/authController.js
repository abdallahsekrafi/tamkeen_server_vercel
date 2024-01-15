import { compareString, createJWT, hashString } from "../utils/index.js";
import Users from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    isDisabled,
    isFMDisabled,
    isMental,
    isMotor,
    isHearing,
    isVisual,
    isPsychological,
  } = req.body;
  //validate required fileds
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }
  try {
    const userExist = await Users.findOne({ email });
    // if email Address already exists
    if (userExist) {
      next("Email Address already exists");
      return;
    }

    // create new user
    const hashedPassword = await hashString(password);
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isDisabled,
      isFMDisabled,
      isMental,
      isMotor,
      isHearing,
      isVisual,
      isPsychological,
    });

    //send email verification to user
    sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }
    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select:
        "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
