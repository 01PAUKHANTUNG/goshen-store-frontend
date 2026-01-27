import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <div>
    <div className='border-t-2 border-gray-500 '>
    <div className='flex flex-col gap-3  sm:flex-row w-[95%] py-4 px-4 justify-between mx-auto '>
       <div>
         <p className='text-black text-xl sm:hidden md:flex mb-2'>About Us</p>
       </div>
       <div>
         <p className='text-black text-xl mb-2'>Contact Us</p>
          <p className='text-gray-500'>Email :</p>
          <p className='text-black '>goshenstore20@gmail.com</p>
          <p className='text-gray-500'>Phone :</p>
          <p className='text-black '>+61 470 499 780</p>
          <p className='text-gray-500 '>Address :</p>
          <p className='text-black '>2C Station St, Ringwood, Melbourne, VIC, Australia, Victoria</p>
       </div>
       <div className=''>
         <p className='text-black text-xl mb-2'>Product Category</p>
          <div className='flex flex-col'>
           <Link  className='text-black cursor-pointer hover:text-amber-500' to='/fruits'>  Fruits</Link>
           <Link  className='text-black cursor-pointer hover:text-amber-500' to='/vegetable'> Vegetable</Link>
         </div>
       </div>
       <div>
          <p className='text-black text-xl mb-2'> Social Media</p>
          <div className='flex flex-col'>
             <a href='https://www.facebook.com/goshenstoreringwood?__cft__[0]=AZVj-Q_7Ko9_mMKs-zrTL2JwvqednWdjZtE67oZfLC_yqCpIuORxqKtpr1rbshik_SNLpJg4Cyr75CP47Akl6i9qnTD63gK4eJLWm7FMgLXSVZR-kddwB7E_wDnsJcfZgXC2Vaxx2FHfLuriyxExuT7dMamUk-GmIqvoDa7Ib4bv_vpRyEkRfZY-seXTbhFrfoM&__tn__=-UC%2CP-R' className='text-black cursor-pointer hover:text-amber-500'>Facebook</a> 
             <a href='' className='text-black cursor-pointer hover:text-amber-500'>Instagram</a> 
           </div>
       </div>
    </div>
    </div>
    <div className='bg-amber-500' >
      <p className='font-semibold text-center py-2 '> Copyright <span> &copy;</span> 2025 All Rights Reserved - Goshen Store </p>
    </div>
    </div>
    
  )
}

export default Footer
