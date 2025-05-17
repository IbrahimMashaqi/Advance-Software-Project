const pool = require("./db_config");

async function getAllSponsorShips() {
  try {
    const [rows] = await pool.query("SELECT * FROM sponsorships");
    return rows;
  } catch (err) {
    throw err.message;
  }
}

async function addSponsorShip(orphan_id, donor_id) {
  if (!orphan_id || !donor_id) throw new Error("No IDs provided");

  try {
    const [res1] = await pool.query("SELECT * FROM users WHERE id = ?", [
      donor_id,
    ]);
    if (res1.length === 0) throw new Error(`No donor with id: ${donor_id}`);

    const [res2] = await pool.query(
      "SELECT * FROM orphans WHERE orphan_id = ?",
      [orphan_id]
    );
    if (res2.length === 0) throw new Error(`No orphan with id: ${orphan_id}`);

    const rows = await pool.query(
      "INSERT INTO sponsorships (donor_id, orphan_id, start_date, status) VALUES (?, ?, ?, ?)",
      [donor_id, orphan_id, new Date(), "pending"]
    );

    return rows;
  } catch (err) {
    throw err;
  }
}

async function getSponsorShip(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sponsorships where sponsorship_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    throw err.message;
  }
}

async function updateSponsorship(id, status, end_date, start_date) {
  try {
    const [result] = await pool.query(
      `UPDATE sponsorships
       SET status = COALESCE(?, status),
           end_date = COALESCE(?, end_date),
           start_date = COALESCE(?, start_date)
       WHERE sponsorship_id = ?`,
      [status, end_date, start_date, id]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

async function deleteSponsor(id) {
  try {
    const [result] = await pool.query(
      "delete from sponsorships where sponsorship_id = ? ",
      [id]
    );

    return result;
  } catch (err) {
    throw err.message;
  }
}

module.exports = {
  getAllSponsorShips,
  addSponsorShip,
  getSponsorShip,
  updateSponsorship,
  deleteSponsor,
};
