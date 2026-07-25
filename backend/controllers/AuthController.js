const db = require("../database");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const [existingUser] = await db.execute(
      "select * from users where email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      throw new ApiError(400, "User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const sql_query =
      "insert into users(username,email,password) values(?,?,?)";
    await db.execute(sql_query, [username, email, hashPassword]);
    return res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sql_query = "select * from users where email = ?";
    const [data] = await db.execute(sql_query, [email]);
    if (data.length === 0) {
      throw new ApiError(400, "Invalid credentials");
    }
    const user = data[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(400, "Invalid credentials");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await db.execute("update users set refresh_token = ? where id = ?", [
      hashedRefreshToken,
      user.id,
    ]);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new ApiError(401, "Refresh token not found");
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const sql_query = "select * from users where id = ?";
    const [data] = await db.execute(sql_query, [decoded.id]);
    if (data.length === 0) {
      throw new ApiError(400, "User not found");
    }
    const user = data[0];
    const ismatch = await bcrypt.compare(token, user.refresh_token);
    if (!ismatch) {
      throw new ApiError(403, "Invalid refresh token");
    }
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await db.execute("update users set refresh_token = ? where id = ?", [
      hashedRefreshToken,
      user.id,
    ]);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, accessToken: accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Refresh token expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(403, "Invalid refresh token"));
    }
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "Refresh token not found");
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const sql_query = "update users set refresh_token = NULL where id = ?";
    await db.execute(sql_query, [decoded.id]);
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Refresh token expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(403, "Invalid refresh token"));
    }
    next(err);
  }
};
module.exports = { register, login, refresh, logout };
