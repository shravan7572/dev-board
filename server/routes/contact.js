const express = require("express");
const { sendEmail } = require("../utils/transporter");
const { UserModel } = require("../models/user");

const ContactRoute = express.Router();

ContactRoute.post("/:username", async function (req, res) {
    try {
        const username = req.params.username;

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Send notifications in the background so the HTTP request completes instantly
        sendEmail({
            replyTo: email,
            to: user.email,
            subject: `New message from ${name}`,
            html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }).catch(err => {
            console.error("Failed to send contact email to profile owner:", err);
        });

        sendEmail({
            to: email,
            subject: `Thanks for contacting ${username}`,
            html: `
        <h2>Message received</h2>
        <p>Hi ${name},</p>
        <p>${username} has received your message and will reply soon.</p>
        <br/>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
      `,
        }).catch(err => {
            console.error("Failed to send receipt email to contact sender:", err);
        });

        return res.status(200).json({
            message: "Email sent successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = ContactRoute;
