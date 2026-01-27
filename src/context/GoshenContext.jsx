import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
//import { products } from '../assets/products';
import { toast } from 'react-toastify';

export const ShopContext = createContext();



const GoshenShopProvider = (props) => {
  const [cartItems, setCartItems] = useState([])
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"


  const currency = "$"
  const delivery = 20;

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  };
  const increase = () => {
    setQuantity(quantity + 1)
  }


  const addToCart = async (id, quantity, price) => {

    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/cart/add', { id, quantity, price }, { headers: { token } })
        if (response.data.success) {
          setCartItems(response.data.cartData)
          toast.success(response.data.message);
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const updateQuantityDeduct = async (id, quantity, price) => {

    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/cart/deduct', { id, quantity, price }, { headers: { token } })
        if (response.data.success) {
          setCartItems(response.data.cartData)

        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const updateQuantityAdd = async (id, quantity, price) => {
    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/cart/plus', { id, quantity, price }, { headers: { token } })
        if (response.data.success) {
          setCartItems(response.data.cartData)
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const getItemCount = () => {
    // Count only unique valid products
    const uniqueValidItems = cartItems.filter(item => products.some(p => p._id === item.id));
    return uniqueValidItems.length;
  }

  const getCartTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      if (products.some(p => p._id === item.id)) {
        total += item.total;
      }
    });
    return Number((total).toFixed(2));
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)

      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeItem = async (id) => {

    try {
      const response = await axios.post(backendUrl + '/api/cart/remove', { id }, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setProducts(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    getProductsData()
  }, [])

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
    if (token) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  }, [token])


  const value = {
    products, currency, addToCart, cartItems, setCartItems, quantity, decrease, increase,
    getItemCount, getCartTotal, updateQuantityDeduct, updateQuantityAdd, removeItem,
    delivery, navigate, backendUrl, token, setToken
  }
  return (
    <ShopContext.Provider value={value} >
      {props.children}
    </ShopContext.Provider>
  )
}

export default GoshenShopProvider
