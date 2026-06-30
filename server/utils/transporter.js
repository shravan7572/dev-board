const nodemailer = require("nodemailer");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS missing!");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,              // ← use 587 instead of default 465
    secure: false,           // ← false for port 587 (uses STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4                // ← forces IPv4, this is the key fix!
});

module.exports = transporter;