import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useUserStore } from '../stores/useUserStore';

const Navbar = () => {


    const { user , logout} = useUserStore()
    const isadmin = user?.role === "admin";

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        E-commerce
                        {/* <div className="fext-red-500">Nitin</div> */}
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link to='/' className='bg-gray-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                            Home
                        </Link>
                        {user && (
                            <Link to={'/cart'}
                                className='bg-gray-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} >
                                    <span>Cart</span>
                                    <span>3</span>
                                </ShoppingCart>
                            </Link>
                        )}

                        {isadmin && (
                            <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}>
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='sm:line'>Dashborad</span>
                            </Link>
                        )}

                        {user ? (
                            <button className='bg-gray-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' onClick={logout}>
                                <LogOut size={18} />
                                <span className='hidden sm:inline ml-2'>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link to={"/signup"} className='bg-gray-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                                    <UserPlus className='m2-1' size={18} />
                                    Sign Up
                                </Link>

                                <Link to={"/login"} className='bg-gray-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                                    <UserPlus className='m2-1' size={18} />
                                    Log In
                                </Link>

                            </>
                        )}

                        {/* <Link to='/signup'>Sign Up</Link>
                        <Link to='/login'>Log In</Link> */}

                    </nav>
                </div>

            </div>
        </header>
    )
}

export default Navbar
