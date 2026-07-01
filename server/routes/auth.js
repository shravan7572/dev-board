const express = require("express");
const { UserModel } = require("../models/user");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const nodemailer=require("nodemailer")
const transporter=require("../utils/transporter")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const userroutes = express.Router();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
userroutes.post("/auth/signup", async function (req, res) {
    try {
        const userzod = z.object({
            username: z
                .string()
                .min(5, { message: "Username must contain at least 5 characters" }),
            email: z.string().email(),
            password: z
                .string({ required_error: "Password is required" })
                .min(8, { message: "Password must be at least 8 characters long" })
                .max(32, { message: "Password cannot exceed 32 characters" })
                .regex(passwordRegex, {
                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                }),
        });

        const parsezoduser = userzod.safeParse(req.body);

        if (!parsezoduser.success) {
            return res.status(400).json({
                message: parsezoduser.error.issues[0].message,
            });
        }

        const { username, email, password } = req.body;

        const userexistornot = await UserModel.findOne({ email });

        if (userexistornot) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedpassword = await bcrypt.hash(password, 9);

        await UserModel.create({
            username,
            email,
            password: hashedpassword,
            isVerified: true // Set to true directly to bypass OTP validation
        });

        res.status(201).json({
            message: "Account created successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

/* Commented out OTP verification & resend endpoints since OTP is disabled
userroutes.post("/auth/otp-verify", async function (req, res) {
    const { email, otp } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: "User not Found!"
        })
    }

    if (user.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    if (user.otpexpiry && Date.now() > new Date(user.otpexpiry).getTime()) {
        return res.status(400).json({
            message: "OTP expired."
        })
    }
    user.isVerified = true
    user.otp = undefined
    user.otpexpiry = undefined
    await user.save()
    res.json({ message: "OTP verified successfully" })

})

userroutes.post("/auth/resend-otp", async function (req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" })
        }

        const otp = generateOTP()
        const otpexpiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp
        user.otpexpiry = otpexpiry
        await user.save()

        // Send new OTP email in background
        res.json({ message: "OTP resent successfully" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})
*/

userroutes.post("/auth/login", async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userlogin = await UserModel.findOne({ email });

        if (!userlogin) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        const comparepassword = await bcrypt.compare(password, userlogin.password);

        if (!comparepassword) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
            { id: userlogin._id.toString() },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            username: userlogin.username,
            message: "Login successful",
        });
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = userroutes;
