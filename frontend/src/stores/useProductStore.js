import {create} from 'zustand';
import axios from '../lib/axios.js';
import {toast} from 'react-hot-toast';
// import axiosInstance from '../lib/axios';


export const useProductStore=create((set)=>({
    products:[],
    loading:false,
    setProducts:(products)=>set({products}),

    createProduct:async(productData)=>{
        set({loading:true});
        try{
            console.log("from create product store", productData)
            const res=await axios.post("/product", productData);
            set((prevState)=>({
                products:[...prevState.products, res.data],
                loading:false,
            }))
            toast.success("Product created successfully")
        } catch(error){
            console.log("Error in createProduct store", error.response.data.error)
            toast.error(error.response.data.error)
            set({loading:false});
        }
    },


    fetchAllProducts:async()=>{
        set({loading:true});
        try{
            const response=await axios.get("/product")
            set({products:response.data.products, loading:false})
        } catch(error){
            set({error:"Failed to fetch products", loading:false})
            toast.error(error.response.data.error || "Failed to fetch products")
            
        }
    },

    fetchProductsByCategory:async(category)=>{
        set({loading:true});
        try{
            const response=await axios.get(`/product/category/${category}`)
            const products = response.data.products || response.data;
            set({products, loading:false})
            // console.log("products by category", products)
        } catch(error){
            set({error:"Failed to fetch products", loading:false})
            toast.error(error.response?.data?.error || "Failed to fetch products")
        }
    },




    deleteProduct:async(id)=>{
        set({loading:true})
        try{
            await axios.post(`/product/${id}`)
            set((prevState)=>({
                products:prevState.products.filter((product)=>product._id!==id),
                laoding:false,
            }))
            toast.success("Product deleted successfully")
        }catch(error){
            set({loading:false})
            toast.error(error.response.data.error || "Failed to delete product")
        }
    },

    toggleFeaturedProduct:async(id)=>{
        set({loading:true})

        try{
            const response=await axios.patch(`/product/${id}`);

            set((prevState)=>({
                products:prevState.products.map((product)=>
                    product._id===id ? {...product, isFeatured:response.data.isFeatured} :product
            ),
            loading:false,
            }))

            toast.success(response.data.isFeatured ? "Product marked as featured" : "Product removed from featured")
        } catch(error){
            set({loading:false})
            toast.error("Failed to update product featured status")
        }
    },


    fetchFeaturedProducts:async()=>{
        set({loading:true});
        try{
            const response=await axios.get("/product/featured");
            // console.log(response.data)
            set({products:response.data, loading:false})

        } catch(error){
                set({error:"Failed to fetch featured products", loading:false})
        }
    }



}))


