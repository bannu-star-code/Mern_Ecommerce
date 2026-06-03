import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import { Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import { useUserStore } from './stores/useUserStore'
import {useEffect} from 'react'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import { CarTaxiFront } from 'lucide-react'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
// import './App.css'
import {useCartStore} from './stores/useCartStore'
import PurchaseCancelPage from './pages/PurchaseCancelPage'

function App() {

  const {user, checkAuth, checkingAuth}=useUserStore()

  const {getCartItems}=useCartStore()

  // console.log(user)
  useEffect(()=>{
    checkAuth();

  }, [checkAuth])

  useEffect(()=>{
    getCartItems();
  },[getCartItems]);

  if(checkingAuth) return <LoadingSpinner/>;
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={!user?<SignupPage/>: <Navigate to="/"/>}/>
        <Route path='/login' element={!user? <LoginPage/>: <Navigate to='/'/>}/>
        <Route path='/secret-dashboard' element={user?.role==='admin'?<AdminPage/>:<Navigate to="/login"/>}/>
        <Route path='/category/:category' element={<CategoryPage />}/>
        <Route path='/cart' element={user?<CartPage/>: <Navigate to="/"/>}/>
        <Route path='/purchase-success' element={<PurchaseSuccessPage/>}/>
        <Route path='/purchase-cancel' element={<PurchaseCancelPage/>}/>
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}

      </Routes>
      <Toaster position="top-center" />
    </div>
    
  )
}

export default App
