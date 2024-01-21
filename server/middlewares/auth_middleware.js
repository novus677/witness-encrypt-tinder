const jwt = require('jsonwebtoken');

require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "No token provided" });
    }

    const token = authHeader.substring(7, authHeader.length);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(400).send({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
