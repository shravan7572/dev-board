const express = require("express");
const mongoose = require("mongoose");
const { UserModel } = require("../models/user")
const { z } = require("zod")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User_Auth = require("../middleware/user_auth");
const JWT_SECRET = process.env.JWT_SECRET;
const userroutes = express.Router()


//tight password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

userroutes.post("/auth/signup", async function (req, res) {
    //zod validation
    const userzod = z.object({
        username: z
            .string()
            .min(5, { message: "first name must contain atleast 5 charcter" }),
        email: z
            .string()
            .email(),
        password: z.
            string({ required_error: "Password is required" })
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(32, { message: "Password cannot exceed 32 characters" })
            .regex(passwordRegex, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            }),
    })
    //parsed zod
    const parsezoduser = userzod.safeParse(req.body);

    if (!parsezoduser.success) {
        return res.status(400).json({
            message: parsezoduser.error.issues[0].message
        });
    }

    const { username, email, password } = req.body
    //checking user already exist or not
    const userexistornot = await UserModel.findOne({ email: email })

    if (userexistornot) {
        return res.status(400).json({
            message: "email already exist"
        })
    }
    //bcrypt the password
    const hashedpassword = await bcrypt.hash(password, 9)
    try {
        await UserModel.create({
            username: username,
            email: email,
            password: hashedpassword
        })
        res.json({
            message: "sign-up succesfully"
        })
    } catch (e) {
        res.json({
            message: "something went wrong"
        })
    }


})


userroutes.post("/auth/login", async function (req, res) {
    const { username, email, password } = req.body

    const userlogin = await UserModel.findOne({
        email: email
    })

    if (!userlogin) {
        return res.status(404).json({
            message: "user not  exist"
        })
    }

    const comparepassword = await bcrypt.compare(password, userlogin.password,)

    if (!comparepassword) {
        return res.json({
            message: "invalid password!"
        })
    }
    try {
        const token = jwt.sign(
            { id: userlogin._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        )


        res.json({
            token,
            message: "login successfully!!"
        })
    } catch (e) {
        res.status(500).json({ message: "something went wrong" })
    }

})

userroutes.get("/myname", User_Auth, function (req, res) {
    res.json({
        name: "shravan choudhary"
    })
})







module.exports = userroutes