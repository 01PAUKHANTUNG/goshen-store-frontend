import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext.jsx';
import Items from '../components/Items.jsx';
import FilterBox from '../components/FilterBox.jsx';
import Title from '../components/Title.jsx';
import { motion } from 'framer-motion';

const VegetablesAndFruits = () => {
  const { products, currency } = useContext(ShopContext);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [result, setResult] = useState([]);
  const [subCategory, setSubCategory] = useState(["Leafy greens", "Root vegetables", "Fruits", "Asia vegetables"])

  useEffect(() => {
    const fruits = products.filter((item) => (item.category === 'Vegetables & Fruits'))
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
        }}><Title title="Vegetables & Fruits" /></motion.div>

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

export default VegetablesAndFruits
