const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function User_Auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not provided",
        });
    }

    try {
        const Usercheck = jwt.verify(token, JWT_SECRET);
        req.userid = Usercheck.id;
        next();
    } catch (e) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

module.exports=User_Auth