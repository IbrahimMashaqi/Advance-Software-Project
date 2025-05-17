const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register } = require("./auth_db");
require("dotenv").config();

const pool = require("./db_config");

async function getUser(id, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the users");
    const [rows] = await pool.query("SELECT * FROM users where id = ? ;", [id]);
    if (rows.length === 0) return { user: "not found", statusCode: 404 };
    rows.forEach((row) => {
      delete row.password;
    });
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function getAllUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    rows.forEach((row) => {
      delete row.password;
    });
    return rows;
  } catch (err) {
    throw err;
  }
}

async function emailCheck(email) {
  try {
    const [rows] = await pool.query("SELECT 1 FROM users WHERE email = ?", [
      email,
    ]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
}

async function updateUser(id, name, password, role) {
  try {
    const [found] = await pool.query("select * from users where id = ?", [id]);
    if (found.length === 0)
      return { message: "user not found", statusCode: 404 };

    const hashedPass = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "UPDATE users SET username = ? , password = ? , role = ? WHERE id = ?",
      [name, hashedPass, role, id]
    );
    const [rows] = await pool.query("select * from users where id = ?", [id]);
    delete rows[0].password;
    return { message: "user updated", statusCode: 200, rows };
  } catch (error) {
    console.log(error);
    return { message: error.message, statusCode: 500 };
  }
}

async function deleteUser(token, id) {
  try {
    const decodedToken = jwt.decode(token);
    if (decodedToken.role !== "admin")
      throw new Error("you are not allowed to delete users");
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return { message: "user not found", statusCode: 404 };
    return { message: "user deleted", statusCode: 200 };
  } catch (error) {
    console.log(error);
    return { message: error.message, statusCode: 500 };
  }
}

module.exports = {
  getUser,
  getAllUsers,
  register,
  emailCheck,
  updateUser,
  deleteUser,
};
