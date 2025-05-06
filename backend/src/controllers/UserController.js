const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const registerUser = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;
    if (!email || !phone || !password || !firstName || !lastName) {
      return res.status(200).json({
        status: "ERR",
        msg: "The input is required",
      });
    }

    const response = await UserService.registerUser(req.body);
    const { refresh_token = null, ...newRespone } = response;
    console.log("123 ", refresh_token);
    if (refresh_token !== null) {
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        samesite: "strict",
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        msg: "The input is required",
      });
    }

    const response = await UserService.signInUser(req.body);

    const { refresh_token, ...newRespone } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      msg: "Log-out successfully",
    });
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }

    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const detailUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        msg: "UserId is required",
      });
    }

    const response = await UserService.detailUser(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { ...payload } = req.body;
    const response = await UserService.updateUser(id, payload);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const sendMailOTP = async (req, res) => {
  try {
    const { email, status } = req.body;
    console.log("email", email);
    console.log("status", status);
    if (!email) {
      return res.status(200).json({
        status: "ERR",
        msg: "Email is required",
      });
    }

    const respone = await UserService.sendMailOTP(email, status);

    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    if (!email || !OTP) {
      return res.status(200).json({
        status: "OK",
        msg: "Email or OTP is required",
      });
    }

    const respon = await UserService.verifyOTP(email, OTP);

    return res.status(200).json(respon);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const verifyOTPLogin = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    if (!email || !OTP) {
      return res.status(200).json({
        status: "OK",
        msg: "Email or OTP is required",
      });
    }

    const respon = await UserService.verifyOTPLogin(email, OTP);
    const { refresh_token, ...newRespone } = respon;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });
    return res.status(200).json(respon);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getTotalUserForAdminDashboard = async (req, res) => {
  try {
    const response = await UserService.getTotalUserForAdminDashboard();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDataLineChartUserAdmin = async (req, res) => {
  try {
    const response = await UserService.getDataLineChartUserAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  registerUser,
  signInUser,
  refreshToken,
  logOutUser,
  detailUser,
  updateUser,
  sendMailOTP,
  verifyOTP,
  verifyOTPLogin,
  getTotalUserForAdminDashboard,
  getDataLineChartUserAdmin,
};
