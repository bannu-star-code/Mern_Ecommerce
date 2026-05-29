import jwt from "jsonwebtoken"
import User from "../backend/models/user.models.js"

export const protectRoute = async (req, res, next) => {
    console.log("from protect route")
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" })
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.statuts(401).json({ message: "User not Found" })
        }

        req.user = user
        next()

    } catch (error) {

        console.log("Error in protect Route Middleware", error.message)
        return res.status(401).json({ message: "Invalid Access Token" })

    }

}


export const adminRoute = (req, res, next) => {
    console.log("from Admin route")
    try {
        // if (req.user && req.user.role === "admin") {
        //     next();
        // }
        // console.log("from Admin route")
        // return res.status(403).json({ message: "Access denied - Admin Only" })

        console.log(req.user)
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied - Admin only"
            });
        }

        next();

    } catch (error) {
        return res.status(403).json({ message: "Access denied - Admin Only" })
    }
}