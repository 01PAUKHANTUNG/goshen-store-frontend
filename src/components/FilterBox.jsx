import React, { useEffect, useState } from 'react'

const FilterBox = ({ products, setResult, subCategory }) => {
  const [filter, setFilter] = useState('all-products');
  const [sort, setSort] = useState('low-high');
  const [sbCategory, setSbCategory] = useState('')

  const filterAndSort = () => {
    if (!products || products.length === 0) return;

    let filtered = products.slice();

    // Apply filter
    switch (filter) {
      case 'in-stock':
        filtered = filtered.filter(item => item.stockAvaiable === true);
        break;
      case 'out-of-stock':
        filtered = filtered.filter(item => item.stockAvaiable === false);
        break;
      default:
        break;
    }

    // Apply SubCategory
    if (sbCategory !== "" && sbCategory !== "All Subcategories") {
      filtered = filtered.filter(item => item.subCategory === sbCategory);
    }

    // Apply sorting
    switch (sort) {
      case 'best':
        filtered = filtered.filter(item => item.bestSelling === true);
        break;
      case 'new':
        filtered = filtered.filter(item => item.newArrive === true);
        break;
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setResult(filtered);
  };

  useEffect(() => {
    filterAndSort();
  }, [filter, sort, products, sbCategory]);

  return (
    <div className='py-8'>
      <div className='flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm'>

        <div className='flex flex-wrap items-center gap-6'>
          {/* Availability Filter */}
          <div className='flex flex-col gap-2'>
            <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Availability</span>
            <div className='relative'>
              <select
                onChange={(e) => setFilter(e.target.value)}
                className='appearance-none bg-gray-50 border border-transparent px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all cursor-pointer min-w-[160px]'
              >
                <option value='all-products'>All Items</option>
                <option value='in-stock'>In Stock</option>
                <option value='out-of-stock'>Sold Out</option>
              </select>
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Subcategory Filter */}
          <div className='flex flex-col gap-2'>
            <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Categories</span>
            <div className='relative'>
              <select
                value={sbCategory}
                onChange={(e) => setSbCategory(e.target.value)}
                className='appearance-none bg-gray-50 border border-transparent px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all cursor-pointer min-w-[200px]'
              >
                <option value="">All Subcategories</option>
                {subCategory.map((item, key) => (
                  <option value={item} key={key}>{item}</option>
                ))}
              </select>
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className='flex flex-col gap-2'>
          <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Sort Marketplace</span>
          <div className='relative'>
            <select
              onChange={(e) => setSort(e.target.value)}
              className='appearance-none bg-black text-white px-8 py-2.5 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-black/20 transition-all cursor-pointer min-w-[220px]'
            >
              <option value='low-high'>Price: Low to High</option>
              <option value='high-low'>Price: High to Low</option>
              <option value='best'>Popular: Best Selling</option>
              <option value='new'>Release: Newest First</option>
            </select>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FilterBox
