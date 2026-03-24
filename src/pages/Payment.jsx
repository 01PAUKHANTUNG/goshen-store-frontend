import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/GoshenContext'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripePaymentForm from '../components/StripePaymentForm'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icon in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_ADD_YOUR_KEY_HERE');

const Payment = () => {
  const { 
    token, navigate, cartItems, products, currency, delivery, setDelivery, getCartTotal, backendUrl, setCartItems,
    deliveryThresholdKm, feeBelowThreshold, feeAboveThreshold, freeDeliveryThresholdAmount, storeLat, storeLng
  } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [distance, setDistance] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState(() => {
    const saved = localStorage.getItem('goshen_last_map_pos');
    return saved ? JSON.parse(saved) : [-37.8136, 144.9631];
  });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  })

  // Sync map with store location if no pin exists
  useEffect(() => {
    if (storeLat && storeLng && !localStorage.getItem('goshen_last_map_pos')) {
      setMapPosition([storeLat, storeLng]);
    }
  }, [storeLat, storeLng]);

  // Save pin to localStorage
  useEffect(() => {
    localStorage.setItem('goshen_last_map_pos', JSON.stringify(mapPosition));
  }, [mapPosition]);

  const onChangeHandle = (e) => setFormData(data => ({ ...data, [e.target.name]: e.target.value }))

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  const reverseGeocode = async (lat, lng) => {
    setIsCalculating(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (response.data && response.data.address) {
        const addr = response.data.address;
        setFormData(prev => ({
          ...prev,
          street: addr.road || addr.suburb || addr.neighbourhood || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          zipcode: addr.postcode || '',
          country: addr.country || ''
        }));
        
        const dist = calculateDistance(lat, lng, storeLat, storeLng);
        setDistance(dist.toFixed(2));
        if (dist < deliveryThresholdKm) {
          setDelivery(feeBelowThreshold);
        } else {
          setDelivery(feeAboveThreshold);
        }
        toast.success("Location pinned! Address updated.");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      toast.error("Error identifying address from map pin.");
    } finally {
      setIsCalculating(false);
    }
  }

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMapPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  }

  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  }

  const updateDeliveryFee = async () => {
    const total = getCartTotal();
    
    // Check for Free Delivery Threshold first
    if (total >= freeDeliveryThresholdAmount) {
      setDelivery(0);
      setDistance(0);
      return;
    }

    if (!formData.street || !formData.city || !formData.country) {
      toast.info("Please fill street, city, and country to calculate delivery fee.");
      return;
    }

    setIsCalculating(true);
    try {
      const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`;
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const dist = calculateDistance(Number(lat), Number(lon), storeLat, storeLng);
        setDistance(dist.toFixed(2));
        
        if (dist < deliveryThresholdKm) {
          setDelivery(feeBelowThreshold);
        } else {
          setDelivery(feeAboveThreshold);
        }
        toast.success(`Delivery fee updated: $${dist < deliveryThresholdKm ? feeBelowThreshold : feeAboveThreshold} (${dist.toFixed(2)} km)`);
      } else {
        toast.error("Could not find coordinates for this address. Using default fee.");
        setDelivery(feeAboveThreshold); // Default to higher fee if address not found
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Error calculating distance. Using default fee.");
      setDelivery(feeAboveThreshold);
    } finally {
      setIsCalculating(false);
    }
  }

  // Update fee if cart total crosses free threshold
  useEffect(() => {
    const total = getCartTotal();
    if (total >= freeDeliveryThresholdAmount && freeDeliveryThresholdAmount > 0) {
      setDelivery(0);
    } else if (distance !== null) {
      // Re-apply distance based fee if below threshold
      if (Number(distance) < deliveryThresholdKm) {
        setDelivery(feeBelowThreshold);
      } else {
        setDelivery(feeAboveThreshold);
      }
    }
  }, [cartItems, freeDeliveryThresholdAmount, distance, deliveryThresholdKm, feeBelowThreshold, feeAboveThreshold])


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    if (!formData.street) {
      toast.error("Please pin your location on the map before confirming your order.");
      setShowMap(true); // Automatically open the map if it was closed
      return;
    }

    console.log("method:", method)
    const loadToast = toast.loading("Finalizing your order...")
    try {
      let orderItems = []
      cartItems.forEach(item => {
        const productInfo = products.find(p => p._id === item.id);
        if (productInfo) {
          const itemCopy = structuredClone(productInfo);
          itemCopy.quantity = item.quantity;
          orderItems.push(itemCopy);
        }
      });

      if (orderItems.length === 0) {
        toast.update(loadToast, { render: "Empty cart detected", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      let orderData = { address: formData, items: orderItems, amount: getCartTotal() + delivery }

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          console.log("response:", response)
          if (response.data.success) {
            setCartItems([])
            toast.update(loadToast, { render: "Order Placed! Welcome to Goshen.", type: "success", isLoading: false, autoClose: 3000 });
            navigate('/order-success', { state: { order: response.data.order } })
          } else {
            toast.update(loadToast, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          console.log("responseStripe:", responseStripe);

          if (responseStripe.data.success) {
            toast.dismiss(loadToast);
            setSessionUrl(responseStripe.data.session_url);
          } else {
            toast.update(loadToast, { render: responseStripe.data.message, type: "error", isLoading: false, autoClose: 3000 });
          }
          break;
      }
    } catch (error) {
      toast.update(loadToast, { render: "Connection error. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  useEffect(() => {
    // Guest checkout allowed, so no check for token
    if (sessionUrl) {
      window.location.replace(sessionUrl);
    }
  }, [sessionUrl])

  return (
    <div className='min-h-screen bg-[#f8f9fa] py-12 md:py-20'>
      <div className='max-w-[1440px] mx-auto px-6 md:px-12'>
        <form onSubmit={onSubmitHandler} className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>

          {/* LEFT: Shipping Info */}
          <div className='lg:col-span-7 flex flex-col gap-10'>
            <div>
              <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2'>Checkout.</h1>
              <p className='text-gray-500 font-medium'>Provide your shipping details below.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100 flex flex-col gap-10'
            >
              <div className='flex items-center gap-4'>
                <span className='w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg'>1</span>
                <h2 className='text-2xl font-black text-gray-900'>Shipping Address</h2>
              </div>

              <div className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>First name</label>
                    <input required onChange={onChangeHandle} name='firstName' value={formData.firstName} className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold' type="text" placeholder='John' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Last name</label>
                    <input required onChange={onChangeHandle} name='lastName' value={formData.lastName} className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold' type="text" placeholder='Doe' />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
                  <input required onChange={onChangeHandle} name='email' value={formData.email} className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold' type="email" placeholder='john@example.com' />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Phone</label>
                    <input required onChange={onChangeHandle} name='phone' value={formData.phone} className='px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 transition-all font-bold' type="number" placeholder='0400 000 000' />
                  </div>
                </div>

                {/* PINNED ADDRESS DISPLAY */}
                <AnimatePresence>
                  {formData.street && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className='bg-amber-50 p-6 rounded-[2rem] border border-amber-100'
                    >
                      <p className='text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2'>Confirmed Delivery Location:</p>
                      <p className='text-sm font-bold text-gray-900 leading-relaxed'>
                        {formData.street}, {formData.city}, {formData.state} {formData.zipcode}, {formData.country}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className='pt-4 flex flex-col gap-4'>
                  <button 
                    type="button" 
                    onClick={() => setShowMap(!showMap)}
                    className='w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2'
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {showMap ? "Close Map" : "Pin Location on Map"}
                  </button>

                  <AnimatePresence>
                    {showMap && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='overflow-hidden'
                      >
                        <div className='h-[300px] w-full rounded-2xl border-2 border-gray-100 overflow-hidden relative z-0 mb-4'>
                          <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <ChangeView center={mapPosition} />
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={mapPosition} />
                            <MapEvents />
                          </MapContainer>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {distance !== null && (
                    <p className='text-center text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter'>
                      Estimated Distance: <span className='text-amber-600'>{distance} KM</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Order Summary */}
          <aside className='lg:col-span-5 flex flex-col gap-10 sticky top-28'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-100 flex flex-col gap-10 relative overflow-hidden'
            >
              <div className='absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-[80px]'></div>

              <h2 className='text-2xl font-black text-gray-900 tracking-tight'>Review Order</h2>

              <div className='flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar'>
                {cartItems.map((item, idx) => {
                  const p = products.find(prod => prod._id === item.id);
                  if (!p) return null;
                  return (
                    <div key={idx} className='flex gap-4 items-center bg-gray-50/50 p-4 rounded-3xl border border-gray-100'>
                      <img src={p.image} className='w-16 h-16 rounded-xl object-contain bg-white' alt='' />
                      <div className='flex-1'>
                        <p className='text-sm font-black text-gray-900 leading-tight line-clamp-1'>{p.description}</p>
                        <div className='flex justify-between items-center mt-1'>
                          <span className='text-[10px] font-bold text-gray-400 uppercase'>Qty: {item.quantity}</span>
                          <p className='text-sm font-black text-amber-600'>{currency}{(p.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className='bg-gray-50 p-8 rounded-[2rem] space-y-4'>
                <div className='flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                  <span>Subtotal</span>
                  <span className='text-gray-900'>{currency}{getCartTotal().toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                  <span>Delivery Fee</span>
                  <span className='text-gray-900'>{currency}{delivery.toFixed(2)}</span>
                </div>
                <div className='h-px bg-gray-200 mt-2'></div>
                <div className='flex justify-between items-end pt-2'>
                  <span className='text-sm font-black text-gray-900 uppercase tracking-widest'>Total Amount</span>
                  <p className='text-4xl font-black text-gray-900 leading-none'>{currency}{(getCartTotal() + delivery).toFixed(2)}</p>
                </div>
              </div>

              <div className='space-y-6'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Payment Method</p>
                <div className='grid grid-cols-2 gap-4'>
                  <div
                    onClick={() => setMethod('stripe')}
                    className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${method === 'stripe' ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                  >
                    <svg className={`w-8 h-8 ${method === 'stripe' ? 'text-amber-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'stripe' ? 'text-amber-700' : 'text-gray-400'}`}>Stripe Pay</span>
                  </div>
                  <div
                    onClick={() => setMethod('cod')}
                    className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${method === 'cod' ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                  >
                    <svg className={`w-8 h-8 ${method === 'cod' ? 'text-amber-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'cod' ? 'text-amber-700' : 'text-gray-400'}`}>COD Pay</span>
                  </div>
                </div>

                <AnimatePresence>
                  {method === 'stripe' && clientSecret ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='mt-8 pt-6 border-t border-gray-100'>
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripePaymentForm clientSecret={clientSecret} orderId={orderId} backendUrl={backendUrl} token={token} setCartItems={setCartItems} navigate={navigate} amount={getCartTotal() + delivery} currency={currency} />
                      </Elements>
                    </motion.div>
                  ) : (
                    <button type='submit' className='w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8'>
                      {method === 'stripe' ? "Secure Payment" : "Confirm Order"}
                    </button>
                  )}
                </AnimatePresence>
              </div>

              <div className='pt-6 flex items-center justify-center gap-2'>
                <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
                <p className='text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none'>SSL Encrypted Transaction</p>
              </div>
            </motion.div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default Payment
