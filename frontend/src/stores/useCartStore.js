import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied:false,
    

    getCartItems: async () => {
        try {
            const response = await axios.get("/cart");
            set({ cart: response.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.error || "Failed to fetch cart items");
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((state) => {
                const existingItem = state.cart.find(item => item._id === product._id);
                const newCart = existingItem
                    ? state.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                    : [...state.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });

            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add product to cart");
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete(`/cart`, { data: { productId } });
            set(prevState => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to remove product");
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
        try {

            await axios.put(`/cart/${productId}`, { quantity });
            set(prevState => ({
                cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
            }));
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update quantity");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let total = subtotal;

        if (coupon) {
            const discount = (subtotal * coupon.discountPercentage) / 100;
            total = subtotal - discount;
        }

        set({ subtotal, total });
    }
}));