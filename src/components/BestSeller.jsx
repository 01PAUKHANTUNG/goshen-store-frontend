import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext.jsx';
import Title from './Title.jsx';
import Items from './Items.jsx';
import { motion } from 'framer-motion';

const BestSeller = () => {

  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestSellerProducts = products.filter((item) => item.bestSelling);
    setBestSeller(bestSellerProducts.slice(0, 30));
  }, [products]);

  return (
    <div>
      <Title title="Best Selling" />

      <div className="grid gap-2 mx-auto sm:grid-cols-2 md:grid-cols-2 sm:gap-3 lg:grid-cols-4 justify-center items-center mt-5">

        {bestSeller.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 2,
              delay: index * 0.05, // stagger effect
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
  );
};

export default BestSeller;
