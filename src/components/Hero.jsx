import React from 'react'
import banner from '../assets/banner.jpg'
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white rounded-[3rem] border border-gray-50 shadow-2xl shadow-black/5">
      <div className="max-w-7xl mx-auto px-10 py-20 flex flex-col md:flex-row items-center justify-between gap-16">

        {/* LEFT SIDE TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 md:w-1/2 relative z-10"
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest'>
            <div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse'></div>
            New Arrivals in Store
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-gray-900 tracking-tight">
            Freshness <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400'>Delivered</span> <br /> To Your Door.
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md">
            Goshen Store Ringwood is your local hub for premium groceries, farm-fresh produce, and high-quality homewares.
          </p>

        </motion.div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="md:w-1/2 relative"
        >
          {/* Decorative glow */}
          <div className='absolute -inset-4 bg-gradient-to-br from-amber-400/20 to-purple-400/20 rounded-[4rem] blur-3xl -z-10'></div>
          <img
            src={banner}
            alt="Hero Banner"
            className="rounded-[3rem] shadow-2xl relative z-10 object-cover aspect-[4/3]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero
