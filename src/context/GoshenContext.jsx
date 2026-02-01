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
  const delivery = 20.00;

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  };
  const increase = () => {
    setQuantity(quantity + 1)
  }


  // Helper to sync local cart to storage
  const saveLocalCart = (items) => {
    localStorage.setItem('guestCart', JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = async (id, quantity, price) => {
    let cartData = structuredClone(cartItems);

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
    } else {
      // Local Cart Logic
      const itemIndex = cartData.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        cartData[itemIndex].quantity += quantity;
        cartData[itemIndex].total = cartData[itemIndex].quantity * price;
      } else {
        cartData.push({ id, quantity, price, total: quantity * price });
      }
      saveLocalCart(cartData);
      toast.success("Added to Cart");
    }
  };

  const updateQuantityDeduct = async (id, quantity, price) => {
    let cartData = structuredClone(cartItems);

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
    } else {
      // Local Cart Logic
      const itemIndex = cartData.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        if (cartData[itemIndex].quantity > 1) {
          cartData[itemIndex].quantity -= 1;
          cartData[itemIndex].total = cartData[itemIndex].quantity * price;
          saveLocalCart(cartData);
        } else {
          // If quantity becomes 0, remove logic is usually handled by removeItem or separate check,
          // but deduction usually stops at 1 or removes. Assuming stop at 1 based on name 'deduct' or similar to backend logic.
          // IF backend logic removes it, we should do same. Backend usually decrements.
          // Let's stick to simple decrement.
          cartData[itemIndex].quantity -= 1;
          if (cartData[itemIndex].quantity === 0) {
            cartData.splice(itemIndex, 1);
          } else {
            cartData[itemIndex].total = cartData[itemIndex].quantity * price;
          }
          saveLocalCart(cartData);
        }
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
    } else {
      // Local Cart Logic
      let cartData = structuredClone(cartItems);
      const itemIndex = cartData.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        cartData[itemIndex].quantity += 1;
        cartData[itemIndex].total = cartData[itemIndex].quantity * price;
        saveLocalCart(cartData);
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
    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/cart/remove', { id }, { headers: { token } })
        if (response.data.success) {
          setCartItems(response.data.cartData)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    } else {
      // Local Cart Logic
      let cartData = structuredClone(cartItems);
      cartData = cartData.filter(item => item.id !== id);
      saveLocalCart(cartData);
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
      // setToken(localStorage.getItem('token')) // Redundant setToken
      getUserCart(token) // Use token from state
    } else {
      // Load Guest Cart
      const localCart = localStorage.getItem('guestCart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
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
