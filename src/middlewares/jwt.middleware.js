const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {

        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        req.userId = decoded.id;
        next();
    });
};
