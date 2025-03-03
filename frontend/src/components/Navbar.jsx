import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

  const location = useLocation();

  const [visible, setVisible] = useState(false);

  const { showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={ assets.logo } className='w-28' alt="logo" />
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>Home</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>Collection</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>About</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>Contact</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        {
          location.pathname === '/collection' &&
          <img src={ assets.search_icon } className='w-5 cursor-pointer' onClick={ () => setShowSearch(!showSearch) } alt="search icon" />
        }

        <div className='group relative'>
          <img onClick={ () => token ? null : navigate('/login') } src={ assets.profile_icon } className='w-5 cursor-pointer' alt="profile icon" />
          
          {/* Dropdown */}
          {
            token 
              &&
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 translate-x-[80px]'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={ () => navigate('/orders') } className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={ logout } className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          }
          
        </div>
        <Link to='/cart' className='relative'>
          <img src={ assets.cart_icon } className='w-5 min-w-5' alt="cart icon" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{ getCartCount() }</p>
        </Link>
        <img src={ assets.menu_icon } className='w-5 cursor-pointer sm:hidden' onClick={ () => setVisible(true) } alt="menu icon" />
      </div>

      {/* Sidebar menu for small screen */}
      <div className={ `absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${ visible ? 'w-full' : 'w-0' }` }>
        <div className='flex flex-col text-gray-600'>
          <div className='flex items-center gap-4 p-3 cursor-pointer' onClick={ () => setVisible(false) }>
            <img src={ assets.dropdown_icon } className='h-4 rotate-180' alt="dropdown icon" />
            <p>Back</p>
          </div>
          <NavLink className='py-2 pl-6 border' to='/' onClick={ () => setVisible(false) }>Home</NavLink>
          <NavLink className='py-2 pl-6 border' to='/collection' onClick={ () => setVisible(false) }>Collection</NavLink>
          <NavLink className='py-2 pl-6 border' to='/about' onClick={ () => setVisible(false) }>About</NavLink>
          <NavLink className='py-2 pl-6 border' to='/contact' onClick={ () => setVisible(false) }>Contact</NavLink>
        </div>
      </div>

    </div>
  )
}

export default Navbar
