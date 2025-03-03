import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {

    const year = new Date().getFullYear();

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={ assets.logo } alt="logo" className='mb-5 w-32' />
            <p className='w-full md:w-2/3 text-gray-600'>
                Stay stylish and updated with the latest trends. Your fashion journey starts here. Explore our collection and enjoy free shipping on all orders!
            </p>
        </div>

        <div>
            <p className='text-xl font-mediummb-5'>Company</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>Get in Touch</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 00000 00000</li>
                <li>contact@foreveryou.com</li>
            </ul>
        </div>
      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>&copy; { year } , forever.com - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer
