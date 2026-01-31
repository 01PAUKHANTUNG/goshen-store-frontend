import React, { useContext } from 'react'
import { ShopContext } from '../context/GoshenContext.jsx'
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const Items = (props) => {
  const { currency } = useContext(ShopContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`premium-card p-6 flex flex-col gap-4 ${!props.stockavaiable && 'opacity-60 grayscale'}`}
    >
      {/* Image Area */}
      <div className='relative aspect-square bg-gray-50 rounded-[2rem] flex items-center justify-center overflow-hidden group/img'>
        <img
          className='w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover/img:scale-110'
          src={props.image}
          alt={props.description}
          crossOrigin='anonymous'
        />

        {props.newArrive && (
          <div className='absolute top-4 left-4 flex gap-2'>
            <span className='px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg'>New</span>
          </div>
        )}

        {!props.stockavaiable && (
          <div className='absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center'>
            <span className='px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full shadow-xl'>Sold Out</span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className='flex flex-col flex-1 gap-2'>
        <div className='flex justify-between items-start'>
          <p className='text-xs font-black text-gray-400 uppercase tracking-widest'>{props.subCategory}</p>
          <p className='text-2xl font-black text-gray-900 leading-none'>{currency}{Number(props.price).toFixed(2)}</p>
        </div>

        <h3 className='text-lg font-bold text-gray-900 leading-tight h-14 line-clamp-2'>
          {props.description}
        </h3>
      </div>

      {/* Actions */}
      <div className='mt-auto flex flex-col gap-4'>
        {props.stockavaiable ? (
          <Link
            to={`/product/${props.id}`}
            className='premium-button-black text-center text-sm py-4'
          >
            View Details
          </Link>
        ) : (
          <button
            disabled
            className='w-full rounded-full py-4 bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed'
          >
            Out of Stock
          </button>
        )}

        {/* Store Pickup Info */}
        <div className='flex items-center gap-2 group/info'>
          <div className={`w-1.5 h-1.5 rounded-full ${props.stockavaiable ? 'bg-success' : 'bg-gray-300'}`}></div>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
            {props.stockavaiable ? 'Goshen Store Pickup' : 'Out of Stock Locally'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Items
