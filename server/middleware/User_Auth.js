const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function User_Auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.json({
            messgae: " token not provided"
        })
    }

    try {
        const Usercheck = jwt.verify(token, JWT_SECRET);
        req.userid = Usercheck.id;
        next();
    } catch (e) {
        res.json({
            messgae: "invalid token"
        })
    }
}

module.exports=User_Auth