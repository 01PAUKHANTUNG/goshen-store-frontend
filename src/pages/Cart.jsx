import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/GoshenContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Cart = () => {
  const { quantity, cartItems, products, currency, updateQuantityDeduct,
    delivery, updateQuantityAdd, removeItem, token, navigate, getCartTotal } = useContext(ShopContext)
  const [cart, setCart] = useState([]);

  const filterData = () => {
    const result = products.filter(product => cartItems.some(cart => cart.id === product._id));
    setCart(result)
  }

  const itemQuantity = (itemId) => {
    const result = cartItems.find(cart => cart.id === itemId);
    return result ? result.quantity : 0;
  };

  const itemTotal = (itemId) => {
    const result = cartItems.find(cart => cart.id === itemId);
    return result ? Number((result.total).toFixed(2)) : 0;
  };

  const payment = async () => {
    if (getCartTotal() > 0) {
      navigate('/payment')
    } else {
      toast.error("Your cart is empty!")
    }
  }

  useEffect(() => {
    filterData()
  }, [products, cartItems])

  return (
    <div className='min-h-screen bg-[#f8f9fa] py-8 md:py-12'>
      <div className='max-w-[1440px] mx-auto px-4 md:px-12'>

        {/* Page Header */}
        <div className='mb-8 md:mb-12 px-2'>
          <h1 className='text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2'>Shopping Basket</h1>
          <p className='text-sm md:text-base text-gray-500 font-medium'>Review your items and prepare for checkout.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start'>

          {/* ================= ITEMS LIST (8 cols) ================= */}
          <div className='lg:col-span-8 space-y-4 md:space-y-6'>
            <AnimatePresence mode='popLayout'>
              {cart.map((item, key) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className='bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group'
                >
                  <div className='flex flex-col md:flex-row gap-6 md:gap-8 items-center'>
                    {/* Image */}
                    <div className='w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center overflow-hidden shrink-0'>
                      <img className='w-4/5 h-4/5 object-contain' src={item.image} alt='' crossOrigin='anonymous' />
                    </div>

                    {/* Content */}
                    <div className='flex-1 flex flex-col gap-1 text-center md:text-left'>
                      <div className='flex items-center justify-center md:justify-start gap-2 mb-1'>
                        <span className='px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg'>{item.category}</span>
                      </div>
                      <h3 className='text-lg md:text-2xl font-black text-gray-900 leading-tight group-hover:text-amber-600 transition-colors'>{item.description}</h3>
                      <p className='text-base md:text-lg font-bold text-gray-400'>{currency}{item.price.toFixed(2)} per unit</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex flex-col items-center md:items-end gap-4 md:gap-6 shrink-0 w-full md:w-auto'>
                      <div className='flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100'>
                        <button
                          className='w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-black hover:text-white transition-all font-black text-xl'
                          onClick={() => updateQuantityDeduct(item._id, itemQuantity(item._id), item.price)}
                        >
                          -
                        </button>
                        <span className='text-xl font-black w-8 text-center'>{itemQuantity(item._id)}</span>
                        <button
                          className='w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-black hover:text-white transition-all font-black text-xl'
                          onClick={() => updateQuantityAdd(item._id, itemQuantity(item._id), item.price)}
                        >
                          +
                        </button>
                      </div>

                      <div className='flex items-center justify-between md:justify-end gap-6 w-full md:w-auto'>
                        <p className='text-2xl font-black text-gray-900'>{currency}{itemTotal(item._id).toFixed(2)}</p>
                        <button
                          onClick={() => removeItem(item._id)}
                          className='p-2 text-gray-300 hover:text-red-500 transition-colors'
                          title="Remove item"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cart.length === 0 && (
              <div className='bg-white rounded-[3rem] p-12 md:p-24 text-center border-2 border-dashed border-gray-200'>
                <p className='text-xl md:text-2xl font-black text-gray-300 uppercase tracking-[0.2em] mb-4'>Your basket is empty</p>
                <button onClick={() => navigate('/')} className='premium-button-black'>Continue Shopping</button>
              </div>
            )}
          </div>

          {/* ================= SUMMARY SECTION (4 cols) ================= */}
          <div className='lg:col-span-4 lg:sticky lg:top-28'>
            <div className='bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-2xl relative overflow-hidden'>
              {/* Decorative Gradient */}
              <div className='absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl'></div>

              <h2 className='text-2xl font-black text-gray-900 mb-8 tracking-tight'>Order Summary</h2>

              <div className='space-y-6 mb-8'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 font-bold uppercase tracking-widest text-[10px]'>Sub-total</span>
                  <span className='text-xl font-bold text-gray-900'>{currency}{getCartTotal().toFixed(2)}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-gray-400 font-bold uppercase tracking-widest text-[10px]'>Delivery</span>
                    <span className='text-[10px] text-green-500 font-black tracking-widest uppercase'>Goshen Standard</span>
                  </div>
                  <span className='text-xl font-bold text-gray-900'>{currency}{(getCartTotal() > 0 ? delivery : 0).toFixed(2)}</span>
                </div>

                <div className='h-px bg-gray-100 my-4'></div>

                <div className='flex justify-between items-end'>
                  <span className='text-gray-900 font-black uppercase tracking-[0.2em] text-sm'>Estimated Total</span>
                  <div className='text-right'>
                    <p className='text-3xl md:text-4xl font-black text-gray-900 leading-none'>{currency}{(getCartTotal() > 0 ? getCartTotal() + delivery : 0).toFixed(2)}</p>
                    <p className='text-[10px] font-bold text-gray-400 mr-1 mt-1'>incl. all local taxes</p>
                  </div>
                </div>
              </div>

              <button
                onClick={payment}
                className='w-full py-5 md:py-6 bg-black text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all'
              >
                Proceed to checkout
              </button>

              <div className='mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>Secure SSL Checkout</p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <p className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>Fast 24H Local Pickup</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
