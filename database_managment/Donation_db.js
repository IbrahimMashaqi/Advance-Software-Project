const mysql = require("mysql2");
require('dotenv').config()



const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
}).promise();


async function addDonation (donorId , amount , category , payment_method , status , emergency_id){

    try{


        const [result] = await pool.query(`
            INSERT INTO donations (donor_id, amount, category, payment_method, status, emergency_id)VALUES (?, ?, ?, ?, ?, ?)`,
            [donorId, amount, category, payment_method, status, emergency_id || null] );

            return result;

    }catch(err){
        throw err;
    }

}


async function getAllDonations () {
    try {

        const [rows] = await pool.query("SELECT * FROM donations");
        return rows;
    } catch (err) {
        throw err.message;
    }
}

async function getDonation (id) {
    try {
        const [rows] = await pool.query("SELECT * FROM donations where donation_id = ?", [id]);
        return rows;
    } catch (err) {
        throw err.message;
    }
}


async function updateDonation(id,amount,category,donation_date,payment_method,status,){
    try{
        const [result] = await pool.query(
            `UPDATE donations
             SET status = COALESCE(?, status),
                 amount = COALESCE(?, amount),
                 category = COALESCE(?, category),
                 donation_date = COALESCE(?, donation_date),
                 payment_method = COALESCE(?, payment_method)

             WHERE donation_id = ?`,
            [status, amount, category ,donation_date , payment_method , id]
        );
        return result;
    }catch(err){
        throw err;
    }
}


async function deleteDonation(id) {
    try {
        const [result] = await pool.query("delete from donations where donation_id = ? ",[id]);

        return result ;
        
    } catch (err) {
        throw err.message;
    }
}

module.exports = {addDonation,getAllDonations , getDonation , updateDonation , deleteDonation}