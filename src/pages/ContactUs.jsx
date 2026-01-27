import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/GoshenContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ContactUs = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Decode user ID if token exists (simple approach) or just pass a flag
      // Better: Backend authUser middleware will handle it if we send token, 
      // but /add is currently public. Let's pass userId explicitly if logged in.

      const payload = { ...formData };
      if (token) {
        // We can't easily get userId here without decoding token, 
        // but we can send the token in headers and let backend handle it,
        // or just send a dummy field and let backend extract from token.
        // Let's just send the token in headers for /add too if available.
      }

      const response = await axios.post(backendUrl + '/api/contact/add', payload, token ? { headers: { token } } : {});
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#f8f9fa] py-12 md:py-24'>
      <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start'>

          {/* LEFT COLUMN: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-5'
          >
            <h1 className='text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 md:mb-8 text-center lg:text-left'>
              Get In <span className='text-amber-500'>Touch.</span>
            </h1>
            <p className='text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-10 md:mb-12 text-center lg:text-left'>
              Have a question? We're here to help you live a fresher life.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-10'>
              <div className='flex gap-5 md:gap-6 items-start p-6 bg-white rounded-3xl lg:bg-transparent lg:p-0'>
                <div className='w-12 h-12 bg-white lg:bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-amber-600'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Our Location</h4>
                  <p className='text-base md:text-lg font-bold text-gray-900'>Ringwood East, VIC 3135<br />Melbourne, AU</p>
                </div>
              </div>

              <div className='flex gap-5 md:gap-6 items-start p-6 bg-white rounded-3xl lg:bg-transparent lg:p-0'>
                <div className='w-12 h-12 bg-white lg:bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-amber-600'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Opening Hours</h4>
                  <p className='text-base md:text-lg font-bold text-gray-900'>Mon - Sat: 9am - 6pm<br />Sun: 10am - 4pm</p>
                </div>
              </div>

              <div className='flex gap-5 md:gap-6 items-start p-6 bg-white rounded-3xl lg:bg-transparent lg:p-0 sm:col-span-2 lg:col-span-1'>
                <div className='w-12 h-12 bg-white lg:bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-amber-600'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Direct Contact</h4>
                  <p className='text-base md:text-lg font-bold text-gray-900'>hello@goshenstore.com.au<br />+61 (03) 9000 0000</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-7 bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100'
          >
            <form onSubmit={onSubmitHandler} className='space-y-6 md:space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Your name</label>
                  <input required name="name" value={formData.name} onChange={onChangeHandler} type="text" placeholder="John Doe" className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300' />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
                  <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="john@example.com" className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300' />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Subject</label>
                <select name="subject" value={formData.subject} onChange={onChangeHandler} className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold cursor-pointer'>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Store Feedback">Store Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Your Message</label>
                <textarea required name="message" value={formData.message} onChange={onChangeHandler} rows="4" placeholder="How can we help?" className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300 resize-none'></textarea>
              </div>

              <button disabled={loading} type="submit" className='w-full py-5 bg-black text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              <p className='text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest'>
                Typical response time: Under 24 hours
              </p>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default ContactUs
