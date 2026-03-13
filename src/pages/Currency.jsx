import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/GoshenContext'

const Currency = () => {
   const { currencies, isLoadingSettings } = useContext(ShopContext)
   const [amount, setAmount] = useState(100)
   const [selectedCurrency, setSelectedCurrency] = useState('')

   useEffect(() => {
      if (currencies && currencies.length > 0 && !selectedCurrency) {
         setSelectedCurrency(currencies[0].code)
      }
   }, [currencies, selectedCurrency])

   if (isLoadingSettings) {
      return (
         <div className='min-h-screen flex items-center justify-center bg-[#fafafa]'>
            <div className='flex flex-col items-center gap-4'>
               <div className='w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
               <p className='text-xs font-black uppercase tracking-widest text-gray-400'>Syncing Rates...</p>
            </div>
         </div>
      )
   }

   if (currencies.length === 0) {
      return (
         <div className='min-h-screen bg-[#fafafa] py-20 flex items-center justify-center'>
            <div className='text-center space-y-4'>
               <div className='text-6xl'>🌍</div>
               <h2 className='text-2xl font-black text-gray-900'>No Exchange Rates Available</h2>
               <p className='text-gray-400 max-w-xs mx-auto text-sm'>Please configure travel rates in the Goshen Admin Panel under Settings.</p>
            </div>
         </div>
      )
   }

   const currentRate = currencies.find(r => r.code === selectedCurrency) || currencies[0]
   const result = (amount * currentRate.buy).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   }

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
   }

   return (
      <div className='min-h-screen bg-[#fafafa] py-12 md:py-20'>
         <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

            {/* HERO SECTION */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className='text-center mb-16'
            >
               <span className='inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-amber-100'>
                  Live Exchange Rates
               </span>
               <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6'>
                  Currency <span className='text-amber-500'>Exchange</span> Centre
               </h1>
               <p className='text-gray-400 font-medium max-w-2xl mx-auto'>
                  Real-time currency conversion for our international Goshen customers.
                  Send with confidence using our competitive daily rates.
               </p>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>

               {/* CALCULATOR WIDGET */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className='lg:col-span-5 premium-card p-8 bg-black text-white relative overflow-hidden'
               >
                  <div className='absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -mr-32 -mt-32 rounded-full'></div>

                  <h2 className='text-xl font-black uppercase tracking-widest mb-8 relative z-10'>Quick Converter</h2>

                  <div className='space-y-6 relative z-10'>
                     <div>
                        <label className='block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2'>You Pay (AUD)</label>
                        <div className='relative'>
                           <span className='absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400'>$</span>
                           <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 font-black text-2xl outline-none focus:border-amber-500/50 transition-all'
                           />
                        </div>
                     </div>

                     <div className='flex justify-center -my-2 relative z-10'>
                        <div className='w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20'>
                           <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                           </svg>
                        </div>
                     </div>

                     <div>
                        <label className='block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2'>They Receive</label>
                        <div className='flex gap-3'>
                           <div className='flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-black text-2xl flex items-center justify-between'>
                              <span>{result}</span>
                              <span className='text-amber-500 text-sm'>{selectedCurrency}</span>
                           </div>
                           <select
                              value={selectedCurrency}
                              onChange={(e) => setSelectedCurrency(e.target.value)}
                              className='bg-white/5 border border-white/10 rounded-2xl px-4 font-black uppercase text-xs outline-none focus:border-amber-500/50 cursor-pointer'
                           >
                              {currencies.map(rate => (
                                 <option key={rate.code} value={rate.code} className="bg-black text-white">{rate.code}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     <div className='pt-4'>
                        <p className='text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center'>
                           1 AUD = {currentRate.buy} {currentRate.code} (Buy Rate)
                        </p>
                     </div>
                  </div>
               </motion.div>

               {/* RATES TABLE */}
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className='lg:col-span-7 premium-card overflow-hidden bg-white'
               >
                  <div className='p-8 border-b border-gray-50 flex items-center justify-between'>
                     <h2 className='text-xl font-black uppercase tracking-widest'>Today's Rates</h2>
                     <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Updated Just Now</span>
                     </div>
                  </div>

                  <div className='overflow-x-auto'>
                     <table className='w-full text-left'>
                        <thead>
                           <tr className='bg-gray-50/50'>
                              <th className='px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Currency</th>
                              <th className='px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Unit</th>
                              <th className='px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Buy</th>
                              <th className='px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Sell</th>
                           </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50'>
                           {currencies.map((rate) => (
                              <motion.tr
                                 key={rate.code}
                                 variants={itemVariants}
                                 className='hover:bg-gray-50/80 transition-colors group'
                              >
                                 <td className='px-8 py-6'>
                                    <div className='flex items-center gap-4'>
                                       <span className='text-2xl'>{rate.flag}</span>
                                       <div>
                                          <p className='font-black text-gray-900'>{rate.country}</p>
                                          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>{rate.code}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className='px-8 py-6 font-bold text-gray-900'>{rate.unit}</td>
                                 <td className='px-8 py-6'>
                                    <div className='flex flex-col'>
                                       <span className='font-black text-lg text-gray-900'>{rate.buy}</span>
                                       <span className='text-[10px] text-gray-400 font-bold uppercase'>{rate.code}</span>
                                    </div>
                                 </td>
                                 <td className='px-8 py-6'>
                                    <div className='flex flex-col text-right md:text-left'>
                                       <span className='font-black text-lg text-amber-600'>{rate.sell}</span>
                                       <span className='text-[10px] text-gray-400 font-bold uppercase'>{rate.code}</span>
                                    </div>
                                 </td>
                              </motion.tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>

            </div>

            {/* FOOTER NOTE */}
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className='mt-16 bg-white rounded-3xl p-8 border border-dashed border-gray-200 text-center'
            >
               <p className='text-gray-400 text-xs font-medium leading-relaxed max-w-3xl mx-auto'>
                  Disclaimer: The rates displayed are indicative and subject to change without prior notice.
                  For exact rates and bulk transactions, please visit us in-store at Ringwood or contact our
                  support team directly. Goshen Store ensures secure and reliable transfers for all our patrons.
               </p>
            </motion.div>

         </div>
      </div>
   )
}

export default Currency
