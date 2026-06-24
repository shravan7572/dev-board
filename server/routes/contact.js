const express = require("express");
const mongoose = require("mongoose");
const transporter = require("../utils/transporter");
const { UserModel } = require("../models/user");

const ContactRoute = express.Router();

ContactRoute.post("/:username", async function (req, res) {
    try {

        const username = req.params.username;

        const user = await UserModel.findOne({ username: username })
        if (!user) {
            return res.status(404).json({
                message: "User not Found!!"
            })
        }
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }


    const info=    await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.HARD_CODED_EMAIL,
            subject: `New message from ${name}!`,
            html: `
            <h2>New Contact Message</h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>

            <hr />

            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        })
   console.log("Email sent successfully!");
console.log("Message ID:", info.messageId);
    

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thanks for contacting ${username}`,
            html: `
        <h2>Message received ✅</h2>
        <p>Hi ${name},</p>
        <p>${username} has received your message and will reply soon.</p>
        <br/>
        <p><b>Your message:</b></p>
        <p>${message}</p>
      `,

        })

         return res.status(200).json({
            message: "email send successfully"
        })



    } catch (e) {

        res.status(500).json({
            message: e.message
        })

    }
})


module.exports = ContactRoute