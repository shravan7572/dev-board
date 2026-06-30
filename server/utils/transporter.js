const nodemailer = require("nodemailer");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("\n=========================================================================");
    console.warn("⚠️  [WARNING] EMAIL_USER or EMAIL_PASS environment variables are missing!");
    console.warn("   Verification emails will fail to send.");
    console.warn("   -> Please add EMAIL_USER and EMAIL_PASS to your environment variables");
    console.warn("      in your Render Dashboard settings.");
    console.warn("=========================================================================\n");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;