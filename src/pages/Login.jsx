import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router';

const Login = () => {
  const [currentState, setCurrentState] = useState('Log In');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmpsd, setConfirmpsd] = useState('');

  const { navigate, backendUrl, token, setToken } = useContext(ShopContext)

  const onSubmitHandle = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Create Account') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password, phone, confirmpsd })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-6 bg-[#f8f9fa]'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-[500px] bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 md:p-12'
      >
        <div className='flex flex-col items-center mb-10'>
          <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-2'>
            {currentState}
          </h1>
          <p className='text-gray-500 font-medium text-center'>
            {currentState === 'Log In'
              ? 'Welcome back to Goshen Store'
              : 'Join our community for fresh groceries'}
          </p>
        </div>

        <form onSubmit={onSubmitHandle} className='flex flex-col gap-6'>
          {currentState === 'Create Account' && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1'>Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
                type='text'
                placeholder='Enter full name'
                required
              />
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1'>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
              type='email'
              placeholder='name@example.com'
              required
            />
          </div>

          {currentState === 'Create Account' && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1'>Phone Number</label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
                type='tel'
                placeholder='+61 000 000 000'
                required
              />
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
              type='password'
              placeholder='••••••••'
              required
            />
          </div>

          {currentState === 'Create Account' && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1'>Confirm Password</label>
              <input
                onChange={(e) => setConfirmpsd(e.target.value)}
                value={confirmpsd}
                className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold placeholder:text-gray-300'
                type='password'
                placeholder='••••••••'
                required
              />
            </div>
          )}

          <div className='flex items-center justify-between px-2'>

            <div className='flex items-center gap-1.5 ml-auto'>
              {currentState === 'Log In' ? (
                <>
                  <span className='text-xs text-gray-400 font-bold'>New here?</span>
                  <button
                    type='button'
                    onClick={() => setCurrentState('Create Account')}
                    className='text-xs font-black text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-widest'
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <span className='text-xs text-gray-400 font-bold'>Existing member?</span>
                  <button
                    type='button'
                    onClick={() => setCurrentState('Log In')}
                    className='text-xs font-black text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-widest'
                  >
                    Login
                  </button>

                </>
              )}
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-5 mt-4 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-black/10 transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]'
          >
            {currentState === 'Log In' ? 'Log In' : 'Create Account'}
          </button>
          <Link to='/' className='w-full text-center py-5 mt-4 bg-green-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-black/10 transition-all hover:bg-green-800 hover:scale-[1.02] active:scale-[0.98]'> Countinous Guest</Link>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
