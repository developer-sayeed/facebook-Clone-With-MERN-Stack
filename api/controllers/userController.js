import createError from "http-errors";
import { isEmail } from "../utility/validate.js";
import User from "../models/User.js";
import { hashPassword, passwordVerify } from "../utility/hash.js";
import { createToken, tokenVerify } from "../utility/token.js";
import { sendActivationLink } from "../utility/sendMail.js";
import { getRandom } from "../utility/math.js";
/**
 * @route /api/v1/user
 * @desc user Register
 * @method POST
 * @access public
 */

export const userRegister = async (req, res, next) => {
  try {
    // Get From Data

    const {
      first_name,
      sur_name,
      email,
      password,
      birth_date,
      birth_month,
      birth_year,
      gender,
    } = req.body;

    // USer Data Validators

    if (
      !first_name ||
      !sur_name ||
      !email ||
      !password ||
      !birth_date ||
      !birth_month ||
      !birth_year ||
      !gender
    ) {
      next(createError(400, "All field are required"));
    }
    // Email Validators
    if (!isEmail(email)) {
      next(createError(400, "Email must be a valid email"));
    }
    // Email Exists Check
    const emailCheck = await User.findOne({ email: email });
    if (emailCheck) {
      next(createError(400, "Email already exists"));
    }
    // Create Activation Code
    let activationCode = getRandom(10000, 99999);

    const checkCode = User.findOne({ access_token: activationCode });

    if (checkCode) {
      activationCode = getRandom(10000, 99999);
    }

    // Store User Data

    const createUser = await User.create({
      first_name,
      sur_name,
      email,
      password: hashPassword(password),
      birth_date,
      birth_month,
      birth_year,
      gender,
      access_token: activationCode,
    });

    if (createUser) {
      // Create Activation token
      const activationToken = createToken({ id: createUser._id }, "30d");

      // sendActivation mail
      await sendActivationLink(createUser.email, {
        name: createUser.first_name + " " + createUser.sur_name,
        link: `${
          process.env.APP_URL + ":" + process.env.PORT
        }/api/v1/user/activate/${activationToken}`,
        code: activationCode,
      });
      res.status(200).json({
        message: "User created successfully",
        user: createUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/v1/user
 * @desc user Login
 * @method POST
 * @access public
 */

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      next(createError(400, "All fields Required"));
    }
    // Email Validators
    if (!isEmail(email)) {
      next(createError(400, "Email must be a valid email"));
    }
    // Email Exists Check
    const loginUser = await User.findOne({ email: email });
    if (!loginUser) {
      next(createError(400, "User does not exist"));
    } else {
      if (!passwordVerify(password, loginUser.password)) {
        next(createError(400, "Password is incorrect"));
      } else {
        // Token
        const token = createToken({ id: loginUser._id }, "365d");

        res.status(200).cookie("authToken", token).json({
          message: "User created successfully",
          user: loginUser,
          token: token,
        });
      }
    }
  } catch (error) {}
};

/**
 * @route /api/v1/user/me
 * @desc user LoggedIn User
 * @method GET
 * @access public
 */

export const loggedInUser = async (req, res, next) => {
  try {
    const auth_token = req.headers.authorization;

    if (!auth_token) {
      return next(createError(400, "Token not found"));
    }

    if (auth_token) {
      const token = auth_token.split(" ")[1];
      const user = tokenVerify(token);

      if (!user) {
        return next(createError(400, "Invalid Token"));
      }

      if (user) {
        const loggedInUser = await User.findById(user.id);

        if (!loggedInUser) {
          return next(createError(400, "User data not match"));
        } else {
          res.status(200).json({
            message: "User data stable",
            user: loggedInUser,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
/**
 * @route /api/v1/user//activate/:token
 * @desc Account Activate
 * @method GET
 * @access Public
 */

export const activateAccount = async (req, res, next) => {
  try {
    // get token
    const { token } = req.params;

    if (!token) {
      next(createError(400, "Invalid activation url"));
    } else {
      // verify token
      const tokenData = tokenVerify(token);

      // check token
      if (!tokenData) {
        next(createError(400, "Invalid Token"));
      }

      // now activate accoumnt
      if (tokenData) {
        const account = await User.findById(tokenData.id);

        if (account.isActivate == true) {
          next(createError(400, "Account already activate"));
        } else {
          await User.findByIdAndUpdate(tokenData.id, {
            isActivate: true,
            access_token: "",
          });

          res.status(200).json({
            message: "Account activate successful",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route /api/v1/user/activate-code
 * @desc activate Account By Code
 * @method POST
 * @access public
 */

export const activateAccountByCode = async (req, res, next) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne().or([{ email: email }, { mobile: email }]);

    if (!user) {
      next(createError(404, "Activation user not found"));
    } else {
      if (user.isActivate == true) {
        next(createError(404, "User account already activate"));
      } else {
        if (user.access_token != code) {
          next(createError(404, "OTP code not match"));
        } else {
          await User.findByIdAndUpdate(user._id, {
            isActivate: true,
            access_token: "",
          });
          res.status(200).json({
            message: "User account activation successful",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
