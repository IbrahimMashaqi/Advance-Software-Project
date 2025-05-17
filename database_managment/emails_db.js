const pool = require("./db_config");

async function getDonors() {
  try {
    const [result] = await pool.query(
      "SELECT * FROM users where role = 'donor'"
    );
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = getDonors;
