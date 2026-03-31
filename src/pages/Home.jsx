import React, { useContext, useEffect, useState } from 'react'
import Items from '../components/Items.jsx'
import Title from '../components/Title.jsx'
import { ShopContext } from '../context/GoshenContext.jsx'
import NewArrival from '../components/NewArrival.jsx'
import BestSeller from '../components/BestSeller.jsx'
import Hero from '../components/Hero.jsx'
import SEO from '../components/SEO.jsx'


const Home = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className='max-w-[1440px] mx-auto px-4 md:px-12 py-8'>
      <SEO title="Home - Goshen Shop" description="Welcome to Goshen Shop. Discover fresh groceries, beauty products, homewares, and more in Ringwood." />
      <div className='mb-12'>
        <Hero />
      </div>
      <div className='mb-16'>
        <NewArrival />
      </div>
      <div className='mb-16'>
        <BestSeller />
      </div>
    </div>
  )
}

export default Home
