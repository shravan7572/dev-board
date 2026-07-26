const express = require("express");
const { UserModel } = require("../models/user");
const { TemoOtpModel } = require("../models/tempotp")
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/transporter");
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
        const username = req.body.username.trim().toLowerCase();
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        const [emailInUsers, usernameInUsers] = await Promise.all([
            UserModel.findOne({ email }),
            UserModel.findOne({ username })
        ]);

        if (emailInUsers) {
            return res.status(409).json({ message: "Email already registered" });
        }
        if (usernameInUsers) {
            return res.status(409).json({ message: "Username already taken" });
        }
        //security thats it 
        await TemoOtpModel.deleteMany({
            $or: [
                { email },
                { username }
            ]
        });


        const otp = generateOTP();
        const otpexpiry = new Date(Date.now() + 10 * 60 * 1000);
        const hashedpassword = await bcrypt.hash(password, 9);


        await TemoOtpModel.create({
            username,
            email,
            password: hashedpassword,
            otp,
            otpexpiry
        });


        sendEmail({
            to: email,
            subject: "Verify your DevBoard account",
            html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 10 minutes</p>`
        }).catch(err => {
            console.error("Verification email sending failed:", err);
        });

        res.status(201).json({
            message: "OTP sent successfully, please verify OTP",
        });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({
                message: "Username or email already taken!"
            })
        }
        res.status(500).json({ message: "Something went wrong" })
    }
});

userroutes.post("/auth/otp-verify", async function (req, res) {
    try {

        const { email, otp } = req.body

        const user = await TemoOtpModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "Please sign-up first"
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
        await UserModel.create({
            username: user.username,
            email: user.email,
            password: user.password,
            isVerified: true
        })

        await TemoOtpModel.deleteOne({ email })
        res.json({ message: "OTP verified successfully! You can now login" })
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

userroutes.post("/auth/resend-otp", async function (req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    try {
        const user = await TemoOtpModel.findOne({ email })
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

        sendEmail({
            to: email,
            subject: "Verify your DevBoard account - Resend OTP",
            html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 10 minutes</p>`
        }).catch(err => {
            console.error("Resend OTP email sending failed:", err)
        })


        res.json({ message: "OTP resent successfully" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

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

        if (!userlogin.isVerified) {
            return res.status(403).json({ message: "Please verify your email first" })
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

userroutes.get("/auth/check-username/:username", async (req, res) => {
    try {
        const username = req.params.username.trim().toLowerCase();

        const existingUser = await UserModel.findOne({
            username: new RegExp(`^${username}$`, "i")
        });

        res.json({
            available: !existingUser
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

module.exports = userroutes;
