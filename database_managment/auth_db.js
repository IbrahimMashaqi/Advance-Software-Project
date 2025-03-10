const mysql = require("mysql2");
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {emailCheck} = require ('../database_managment/users_DB')



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
  
      const accessToken = jwt.sign({ id: user.id, role: user.role, email: user.email },process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "10d" }
      );

      const refreshToken = jwt.sign({ id: user.id, role: user.role, email: user.email },process.env.REFRESH_TOKEN_SECRET,{ expiresIn: "30m" }
      );

      await pool.query('update users set refresh_token = ? where id = ?',[refreshToken,user.id])

      delete user.password
      delete user.refresh_token
      return { accessToken,refreshToken,user, message: "Login successful." };
    }catch (error) {
      throw error;
    }
  }

async function register(name,email,password,role){
  try{
    const found = await emailCheck(email)
    if (found)
         throw new Error ('email alredy used')
    if (role !=='admin' && role !== 'volunteer' && role !=='donor') throw new Error ('role must be admin , donor , volunteer')
    const hashedPassword= await bcrypt.hash(password,10)
    const [result]=await pool.query('insert into users (username,email,password,role) values (?,?,?,?)',[name,email,hashedPassword,role]);
    return {id :result.insertId ,message : "user added successfully"};
}catch(error){
    throw error
  }
}



  module.exports = {login,register,pool}