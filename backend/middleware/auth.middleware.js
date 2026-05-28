import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

export const adminRoute = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden - Admin access required" });
        }
        
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};
