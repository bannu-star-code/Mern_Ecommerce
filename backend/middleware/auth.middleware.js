import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ error: "Unauthorized - User not found" });

        req.userId = decoded.userId;
        req.role = decoded.role;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

export const adminRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden - Admin access required" });
        }

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: "Unauthorized - User not found" });

        req.userId = decoded.userId;
        req.role = decoded.role;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};
