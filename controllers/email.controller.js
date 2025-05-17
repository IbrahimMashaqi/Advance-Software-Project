const nodemailer = require("nodemailer");
require("dotenv").config();
const getDonors = require("../database_managment/emails_db");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendEmail(donor, title, txt) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: donor.email,
    subject: `Emergency Alert - ${title}`,
    text: txt,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(`Email sent to ${donor.email} `);
    }
  });
}

async function notifyDonors(title, txt) {
  try {
    const donors = await getDonors();

    donors.forEach((donor) => {
      const text = `Dear ${donor.username} ${txt}`;
      sendEmail(donor, title, text);
    });
  } catch (err) {
    throw err;
  }
}

module.exports = notifyDonors;
