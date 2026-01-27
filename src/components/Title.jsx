import React from 'react'

const Title = ({ title }) => {
  return (
    <div className='mb-8 px-2'>
      <h2 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter flex items-end gap-2'>
        {title}<span className='w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full mb-1 sm:mb-2'></span>
      </h2>
      <div className='w-20 h-1.5 bg-gray-100 rounded-full mt-2'></div>
    </div>
  )
}

export default Title
