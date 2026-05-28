import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"
import couponRoutes from "./routes/coupon.routes.js"
import paymentRoutes from "./routes/payment.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
// import productRoutes from "./routes/product.routes.js"
import { connectDB } from "./lib/lib.js";
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Added in Git
// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/app/coupon", couponRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.listen(PORT, () => {
    console.log("the server running on port Https:" + PORT)
    connectDB()
})


// jBkmZgyKOOj647rl

// mongodb+srv://<db_username>:<db_password>@cluster0.gqki0sj.mongodb.net/?appName=Cluster0