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
// import './App.css'

function App() {

  const {user, checkAuth, checkingAuth}=useUserStore()

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(checkingAuth) return <LoadingSpinner/>;
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={!user?<SignupPage/>: <Navigate to="/"/>}/>
        <Route path='/login' element={!user? <LoginPage/>: <Navigate to='/'/>}/>
      </Routes>
      <Toaster position="top-center" />
    </div>
    
  )
}

export default App
