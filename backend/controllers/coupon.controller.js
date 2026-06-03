import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    // code=req.query.code
    //     console.log(code, "codee")
        
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })
        // console.log("coupon from getCoupon controller", coupon)
        res.json(coupon || null);

    } catch (error) {
        console.log("Error in getCoupon controller", error.message)
        res.json({ message: "server error", error: error.message })
    }
}

export const validateCoupon = async (req, res) => {
    console.log(req.body, "vmvmvmvmvmvm")

    try {
        const { code } = req.body
        console.log("code from validate controller", code)
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" })
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon Expired" })
        }
        console.log("in validate")

        res.json({
            message: "Coupon is Valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.log("Error in validate controller", error.message)
        res.json({ message: "server error", error: error.message })

    }
}