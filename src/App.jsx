import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Navbar from './components/Navbar'

import Footer from './components/Footer'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import ProductItems from './pages/ProductItems'
import Cart from './pages/Cart'
import Beauti from './pages/Beauti'
import { ToastContainer } from 'react-toastify'
import VegetablesAndFruits from './pages/VegetablesAndFruits'
import SnaksAndDrinks from './pages/SnaksAndDrinks'
import BooksAndStationery from './pages/BooksAndStationery'
import Homewares from './pages/Homewares'
import Groceries from './pages/Groceries'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import OrderSuccess from './pages/order-success'
import Inquiries from './pages/Inquiries'

const App = () => {
  return (
    <div className=''>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/vegetables&fruits' element={<VegetablesAndFruits />} />
        <Route path='/beauti&cosmetics' element={<Beauti />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/snacks&drinks' element={<SnaksAndDrinks />} />
        <Route path='/homewares' element={<Homewares />} />
        <Route path='/books&stationery' element={<BooksAndStationery />} />
        <Route path='/groceries' element={<Groceries />} />
        <Route path='/product/:productId' element={<ProductItems />} />
        <Route path='/login' element={<Login />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/order-success' element={<OrderSuccess />} />
        <Route path='/my-inquiries' element={<Inquiries />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
