import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext.jsx';
import Title from './Title.jsx';
import Items from './Items.jsx';
import { motion } from 'framer-motion';

const NewArrival = () => {

  const { products } = useContext(ShopContext);
  const [newArrive, setNewArrive] = useState([]);

  useEffect(() => {
    const newProducts = products.filter((item) => item.newArrive);
    setNewArrive(newProducts.slice(0, 30));
  }, [products]);


  return (
    <div>
      <Title title="New Arrivals" />

      <div className="grid gap-2 mx-auto sm:grid-cols-2 md:grid-cols-2 sm:gap-3 lg:grid-cols-4 justify-center items-center mt-5">

        {newArrive.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: index * 0.05,
            }}
          >
            <Items
              id={item._id}
              image={item.image}
              price={item.price}
              description={item.description}
              stockavaiable={item.stockAvaiable}
              newArrive={item.newArrive}
              subCategory={item.subCategory}
            />
          </motion.div>
        ))}

      </div>
    </div>
  )
}

export default NewArrival
