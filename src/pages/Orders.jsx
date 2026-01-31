import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/GoshenContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
    const { backendUrl, token, currency, navigate } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrderData = async () => {
        try {
            if (!token) return;
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                // Reverse to show newest first
                setOrderData(response.data.orders.reverse());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            loadOrderData();
        }
    }, [token]);

    const getStatusStep = (status) => {
        const steps = ['Order Placed', 'Shipped', 'Out for delivery', 'Delivered'];
        const index = steps.indexOf(status || 'Order Placed');
        return index >= 0 ? index : 0;
    };

    return (
        <div className='min-h-screen bg-[#f8f9fa] py-12 md:py-20'>
            <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

                {/* Page Header */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12'>
                    <div>
                        <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2'>Order History.</h1>
                        <p className='text-gray-500 font-medium'>Track your fresh selection and past purchases.</p>
                    </div>
                    <div className='flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm'>
                        <button onClick={loadOrderData} className='px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all'>
                            Refresh List
                        </button>
                        <span className='px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl'>
                            {orderData.length} Total
                        </span>
                    </div>
                </div>

                <div className='flex flex-col gap-8'>
                    {loading ? (
                        <div className='py-20 flex justify-center'>
                            <div className='w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
                        </div>
                    ) : orderData.length > 0 ? (
                        <AnimatePresence>
                            {orderData.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.1, 0.5) }}
                                    className='bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden'
                                >
                                    {/* Glass Header */}
                                    <div className='bg-gray-50/50 backdrop-blur-md px-8 md:px-12 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6'>
                                        <div className='flex gap-10'>
                                            <div>
                                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Placed on</p>
                                                <p className='text-sm font-bold text-gray-900'>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Total Amount</p>
                                                <p className='text-sm font-black text-amber-600'>{currency}{order.amount.toFixed(2)}</p>
                                            </div>
                                            <div className='hidden sm:block'>
                                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Ship To</p>
                                                <p className='text-sm font-bold text-gray-900'>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1'>Reference ID</p>
                                            <p className='text-[10px] font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-lg'>{order._id}</p>
                                        </div>
                                    </div>

                                    <div className='p-8 md:p-12'>
                                        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>

                                            {/* Items List */}
                                            <div className='lg:col-span-7 space-y-6'>
                                                {order.items.map((item, i) => (
                                                    <div key={i} className='flex gap-6 items-center group'>
                                                        <div className='w-24 h-24 bg-gray-50 rounded-[1.5rem] border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-4'>
                                                            <img src={item.image} alt={item.name} className='w-full h-full object-contain transition-transform group-hover:scale-110' crossOrigin='anonymous' />
                                                        </div>
                                                        <div className='flex-1'>
                                                            <p className='text-lg font-black text-gray-900 group-hover:text-amber-600 transition-colors leading-tight'>{item.name}</p>
                                                            <div className='flex items-center gap-4 mt-1'>
                                                                <span className='px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Qty: {item.quantity}</span>
                                                                <p className='text-sm font-black text-gray-400'>{currency}{item.price.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Status Timeline */}
                                            <div className='lg:col-span-5 flex flex-col justify-center border-l border-gray-50 lg:pl-12'>
                                                <div className='flex flex-col gap-8'>
                                                    {['Order Placed', 'Shipped', 'Out for delivery', 'Delivered'].map((step, i) => {
                                                        const currentStep = getStatusStep(order.status);
                                                        const isCompleted = i <= currentStep;
                                                        const isCurrent = i === currentStep;

                                                        return (
                                                            <div key={step} className='flex items-center gap-6 group'>
                                                                <div className='relative flex flex-col items-center'>
                                                                    <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-200'
                                                                        } ${isCurrent ? 'scale-125 shadow-xl shadow-black/10' : ''}`}>
                                                                        {isCompleted ? (
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                                        ) : (
                                                                            <div className='w-1.5 h-1.5 rounded-full bg-gray-200'></div>
                                                                        )}
                                                                    </div>
                                                                    {i < 3 && <div className={`w-1 h-8 my-1 rounded-full transition-colors duration-500 ${i < currentStep ? 'bg-black' : 'bg-gray-100'}`}></div>}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>{step}</p>
                                                                    {isCurrent && <p className='text-[10px] font-bold text-amber-500 uppercase tracking-widest animate-pulse mt-0.5'>Current Status</p>}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className='mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paied' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Payment: {order.paymentStatus}</p>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100'
                        >
                            <div className='w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6'>
                                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                            <h3 className='text-2xl font-black text-gray-300 uppercase tracking-[0.3em] mb-2'>No orders yet</h3>
                            <p className='text-gray-400 font-medium mb-10'>Start your journey with Goshen Store today.</p>
                            <button onClick={() => navigate('/')} className='px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all'>
                                Start Shopping
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
