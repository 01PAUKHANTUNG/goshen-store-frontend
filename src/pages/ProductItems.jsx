import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ShopContext } from '../context/GoshenContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ProductItems = () => {
  const { products, currency, addToCart, cartItems, quantity, decrease, increase, token, navigate } = useContext(ShopContext);
  const { productId } = useParams();
  const [productData, setProductData] = useState(false);

  const payment = async () => {
    if (!token) {
      toast.error("Please login to proceed")
      navigate('/login')
    }
  }

  const fetchProductData = () => {
    const found = products.find(item => item._id === productId);
    if (found) setProductData(found);
  };

  const getProductTotal = () => {
    if (!productData) return 0;
    return Number((productData.price * quantity).toFixed(2));
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products]);

  if (!productData) return <div className='min-h-screen flex items-center justify-center p-10'><div className='w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div></div>;

  return (
    <div className='min-h-screen bg-[#f8f9fa] py-8 md:py-16'>
      <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

        {/* Breadcrumb / Back Navigation */}
        <button onClick={() => navigate(-1)} className='mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors group'>
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          <span className='text-[10px] uppercase tracking-[0.2em]'>Back to Shop</span>
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center'>

          {/* IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='relative'
          >
            <div className='absolute -inset-10 bg-amber-100/30 rounded-full blur-[100px] -z-10'></div>
            <div className='bg-white rounded-[3rem] md:rounded-[5rem] p-10 md:p-20 shadow-2xl border border-gray-100 flex items-center justify-center aspect-square overflow-hidden group'>
              <img
                className='w-full h-full object-contain transition-transform duration-700 group-hover:scale-110'
                src={productData.image}
                alt={productData.description}
                crossOrigin='anonymous'
              />
            </div>

            {/* Status Batch */}
            <div className='absolute top-8 left-8 flex flex-col gap-2'>
              <span className='px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl'>Fresh in stock</span>
              {productData.bestSelling && <span className='px-4 py-2 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl'>Bestseller</span>}
            </div>
          </motion.div>

          {/* CONTENT SECTION */}
          <div className='flex flex-col gap-6 md:gap-8'>
            <div className='space-y-4'>
              <p className='text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]'>Goshen Premium Collection</p>
              <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none'>
                {productData.description}
              </h1>
              <div className='flex items-center gap-4'>
                <p className='text-3xl md:text-4xl font-black text-gray-900'>{currency}{productData.price.toFixed(2)}</p>
                <span className='text-gray-400 font-bold uppercase tracking-widest text-xs'>per unit</span>
              </div>
            </div>

            <div className='h-px bg-gray-100 w-full'></div>

            <p className='text-gray-500 font-medium text-lg leading-relaxed max-w-xl'>
              Experience the peak of freshness with our {productData.category} selection. Sourced daily and guaranteed to provide the highest nutritional quality for your home.
            </p>

            <div className='space-y-8 mt-4'>
              <div className='flex flex-wrap items-center gap-8'>
                {/* Quantity Manager */}
                <div className='flex flex-col gap-3'>
                  <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Quantity</span>
                  <div className='flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm'>
                    <button onClick={() => decrease()} className='w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all font-black text-xl'>-</button>
                    <p className='text-2xl font-black w-10 text-center'>{quantity}</p>
                    <button onClick={() => increase()} className='w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all font-black text-xl'>+</button>
                  </div>
                </div>

                {/* Total Display */}
                <div className='flex flex-col gap-1'>
                  <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Total Price</span>
                  <p className='text-4xl font-black text-gray-900'>{currency}{getProductTotal().toFixed(2)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={token ? () => addToCart(productData._id, quantity, productData.price, getProductTotal()) : () => payment()}
                  className='flex-1 py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all'
                >
                  Add to Cart
                </button>

              </div>
            </div>

            {/* Delivery / Trust Badges */}
            <div className='mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Freshly Packed Today</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Local Ringwood Pickup</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductItems
