const jwt = require("jsonwebtoken");
require("dotenv").config();
const { login, register, pool } = require("../database_managment/auth_db");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.status(200).send({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Email or password are not correct.");
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const data = await register(name, email, password, role);
    const result = await login(email, password);
    res.status(201).send({ user: result.user, token: result.accessToken });
  } catch (error) {
    res.status(409).send(error.message);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    const [rows] = await pool.query(
      "select * from users where refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) return res.sendStatus(403);

    const user = rows[0];

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(500);

      const accessToken = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(404).send(err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send("Refresh token is required");

    const [rows] = await pool.query(
      "select * from users where refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) return res.sendStatus(403);

    await pool.query("update users set refresh_token = null where id = ?", [
      rows[0].id,
    ]);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
};
