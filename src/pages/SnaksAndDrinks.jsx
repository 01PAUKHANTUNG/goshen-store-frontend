import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext';
import FilterBox from '../components/FilterBox';
import Title from '../components/Title';
import Items from '../components/Items';
import { motion } from 'framer-motion';

const SnaksAndDrinks = () => {
  const { products, currency } = useContext(ShopContext);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [result, setResult] = useState([]);
  const [subCategory, setSubCategory] = useState(["Chips", "Candies", "Biscuits", "Soft drinks", "Energy drinks", "Asian beverages", "Tea", "Coffee"])

  useEffect(() => {
    const fruits = products.filter((item) => (item.category === 'Snacks & Drinks'))
    setFruitProducts(fruits)
  }, [products])


  return (
    <div className='max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12'>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 2
        }}> <Title title="Snaks & Drinks" /></motion.div>

      <FilterBox products={fruitProducts} setResult={setResult} subCategory={subCategory} />
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 2
        }}
        className='flex mx-auto'>
        <div className="grid gap-2 mx-auto sm:grid-cols-2 md:grid-cols-2 sm:gap-3 lg:grid-cols-4 justify-center items-center mt-5 ">
          {
            result.map((item, key) => {
              return <Items
                key={key}
                id={item._id}
                image={item.image}
                price={item.price}
                description={item.description}
                stockavaiable={item.stockAvaiable}
                newArrive={item.newArrive}
                subCategory={item.subCategory}
              />
            })
          }
        </div>
      </motion.div>
    </div>
  )
}

export default SnaksAndDrinks
