import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.jpg'

const AboutUs = () => {
  return (
    <div className='min-h-screen bg-white overflow-hidden py-12 md:py-16'>
      <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

        {/* HERO SECTION */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center lg:text-left'
          >
            <h1 className='text-4xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6 md:mb-8'>
              Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400'>Story.</span>
            </h1>
            <p className='text-lg md:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0'>
              Established in the heart of Ringwood, Goshen Store was born from a simple mission: to provide our community with the freshest, highest quality groceries and homewares.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative'
          >
            <div className='absolute -inset-6 md:-inset-10 bg-amber-100/50 rounded-full blur-[60px] md:blur-[100px] -z-10'></div>
            <div className='bg-gray-50 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100'>
              <img src={logo} alt='About Goshen' className='w-full rounded-[1.5rem] md:rounded-[2rem] shadow-lg' />
            </div>
          </motion.div>
        </div>

        {/* CORE VALUES */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32'>
          {[
            { title: 'Local First', desc: 'We source our produce from trusted local farms to ensure maximum freshness.' },
            { title: 'Quality Matters', desc: 'Every product on our shelves is hand-selected and verified for quality.' },
            { title: 'Eco Friendly', desc: 'We are committed to sustainable practices and reducing waste.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className='bg-gray-50 p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-transparent hover:border-amber-400/20 hover:bg-white hover:shadow-2xl transition-all group'
            >
              <div className='w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-amber-500 transition-colors shrink-0'>
                <span className='text-white font-black'>{idx + 1}</span>
              </div>
              <h3 className='text-xl md:text-2xl font-black text-gray-900 mb-4 tracking-tight'>{item.title}</h3>
              <p className='text-base text-gray-500 font-medium leading-relaxed'>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* MISSION STATEMENT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='bg-black rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden'
        >
          <div className='absolute top-0 left-0 w-full h-full bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-10'></div>
          <h2 className='text-3xl md:text-6xl font-black text-white tracking-tight mb-6 md:mb-8 relative z-10'>
            "Bringing the <span className='text-amber-500'>Market</span> <br className='hidden md:block' /> To Your Kitchen."
          </h2>
          <p className='text-gray-400 text-sm md:text-xl font-medium max-w-2xl mx-auto relative z-10'>
            We believe that healthy living starts with the ingredients you bring home. Our mission is to make premium, fresh groceries accessible to everyone.
          </p>
        </motion.div>

      </div>
    </div>
  )
}

export default AboutUs
