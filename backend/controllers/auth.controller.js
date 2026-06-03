import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = async (userId, role = "customer") => {
    const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });

    const refreshToken = jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    return { accessToken, refreshToken }

};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export const signup = async (req, res) => {

    const { email, password, name } = req.body

    const userExits = await User.findOne({ email });

    if (userExits) {
        return res.status(400).json({ message: "User already exits" });
    }

    const user = await User.create({ name, email, password })

    const { accessToken, refreshToken } = await generateTokens(user._id, user.role);
    
    await storeRefreshToken(user._id, refreshToken)

    setCookies(res, accessToken, refreshToken)

    res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, message: "User created successfult"
    });
};

export const login = async (req, res) => {
    // res.send("login route called")
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        console.log(user)
        console.log(user.comparePassword(password), "heee")
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = await generateTokens(user._id, user.role)
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" })
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    // res.send("logout route called")
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken)
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(decoded)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const l = async (req, res) => {
    res.json("Hellooo")
}