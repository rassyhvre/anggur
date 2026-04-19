const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Fallback untuk testing Mobile yang tidak memiliki UI Login
        req.user = { id: 1 };
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Fallback jika token expired untuk testing cepat
        req.user = { id: 1 };
        return next();
    }
};

module.exports = { verifyToken };
