import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext';
import Title from '../components/Title';
import FilterBox from '../components/FilterBox';
import Items from '../components/Items';
import { motion } from 'framer-motion';


const Groceries = () => {
  const { products, currency } = useContext(ShopContext);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [result, setResult] = useState([]);
  const [subCategory, setSubCategory] = useState(["Rice", "Noodles", "Cooking oil", "Salt", "Sugar", "Sauces", "Spices & seasoning", "Canned foods", "Dry beans & lentils", "Instant foods", "Dry food", "Corn & maize"])

  useEffect(() => {
    const fruits = products.filter((item) => (item.category === 'Groceries'))
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
        }}> <Title title="Groceries" /></motion.div>

      <FilterBox products={fruitProducts} setResult={setResult} subCategory={subCategory} />
      <div className='flex mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 2
          }}
          className="grid gap-2 mx-auto sm:grid-cols-2 md:grid-cols-2 sm:gap-3 lg:grid-cols-4 justify-center items-center mt-5 ">
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
        </motion.div>
      </div>
    </div>
  )
}

export default Groceries
