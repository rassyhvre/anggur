const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Tidak ada header Authorization -> guest fallback untuk testing
        console.log("[Auth] No auth header, using guest fallback (id: 1)");
        req.user = { id: 1 };
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`[Auth] Token error: ${error.message}`);
        // Token ada tapi invalid/expired -> return 401
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluarsa. Silakan login ulang.",
        });
    }
};

module.exports = { verifyToken };
