import React from 'react'
import { useState } from 'react'
import { PlusCircle , ShoppingBasket, BarChart} from 'lucide-react'
import { motion } from "framer-motion";
import ProductsList from '../components/ProductsList';
import AnalyticsTab from '../components/AnalyticsTab';
import CreateProductForm from '../components/CreateProductForm';
import {useProductStore} from '../stores/useProductStore'
import {useEffect} from 'react'


const tabs=[
    {id:"create", label:"Create Product", icon:PlusCircle},
    {id:"products", label:"Products", icon:ShoppingBasket},
    {id:"analytics", label:"Analytics", icon:BarChart},
  ]

const AdminPage = () => {
  const [activeTab, setActiveTab]=useState("create")
  const {fetchAllProducts}=useProductStore()

  useEffect(()=>{
    fetchAllProducts();
  }, [fetchAllProducts])
  
  return (
    <div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

        {/* Tab Navigation */}
        <div className='flex gap-4 mb-8 justify-center flex-wrap'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className='bg-gray-900 border border-gray-800 rounded-lg p-8'
        >
          {activeTab === 'create' && <CreateProductForm/>}

          {activeTab === 'products' && <ProductsList/>}

          {activeTab === 'analytics' && <AnalyticsTab/>}
        </motion.div>
      </div>
      </div>

    
  )
}

export default AdminPage
