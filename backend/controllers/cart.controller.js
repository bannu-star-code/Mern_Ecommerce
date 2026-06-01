import Product from "../models/product.model.js"
import User from "../models/user.models.js"




export const getCartProducts = async (req, res) => {
    try {
        // user.cartItems is an array of { product: ObjectId, quantity }
        const productIds = req.user.cartItems.map((ci) => ci.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => String(cartItem.product) === String(product._id));
            return { ...product.toObject(), quantity: item ? item.quantity : 1 };
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message)
        res.status(500).json({ message: "server error", error: error.message })
    }
}


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user;

        const existingItem = user.cartItems.find((item) => String(item.product) === String(productId));
        if (existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in addToCart controller", error.message)
        res.status(500).json({ message: "server error", error: error.message })
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => String(item.product) !== String(productId));
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart controller", error.message)
        res.status(500).json({ message: "server error", error: error.message })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params
        const { quantity } = req.body
        const user = req.user
        const existingItem = user.cartItems.find((item) => String(item.product) === String(productId));
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => String(item.product) !== String(productId));
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found" });

        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message)
        res.status(500).json({ message: "server error", error: error.message })
    }
}



export const controllerExample = async (req, res) => {
    try {

    } catch (error) {

    }
}

