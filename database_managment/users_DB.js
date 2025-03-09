const mysql = require("mysql2");
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
}).promise();

async function login(email, pass) {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
    const user = rows[0];

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) 
      throw new Error("Invalid email or password.");

    const token = jwt.sign(
      { id: user.id, name: user.username, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return { token,user, message: "Login successful." };
  }catch (error) {
    throw error;
  }
}

async function getUser(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM users where id = ? ;',[id]);
    delete rows.password
    return rows
  } catch (err) {
      throw err
  }
}

async function getAllUsers(){
  try{
    const [rows] = await pool.query('SELECT * FROM users');
    rows.forEach(row => {
      delete row.password;
    });
    return rows;
  }catch(err){
    throw new Error(err)
  }
}

async function addUser(name,email,password,role){
  try{
    
    const hashedPassword= await bcrypt.hash(password,10)
    const [result]=await pool.query('insert into users (username,email,password,role) values (?,?,?,?)',[name,email,hashedPassword,role]);
    return {id :result.insertId ,message : "user added successfully"};
  }catch(error){
    throw new Error (error)
  }
}

async function emailCheck(email){
  const [row] = await pool.query('select * from users where email = ? ',[email])
  return row.length>0
}

// (async()=>{
//   const s=addUser('ibrahim','mashaqi2@edu','123','donor')
// })()


module.exports={
  login,
  getUser,
  getAllUsers,
  addUser,
  emailCheck
};