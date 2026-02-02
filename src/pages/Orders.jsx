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
                setOrderData(response.data.orders);
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

    const downloadReceipt = (order) => {
        const receiptWindow = window.open('', '_blank');

        const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - Order ${order._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
            h1 { font-size: 24px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px; }
            h2 { font-size: 16px; margin: 0; color: #666; font-weight: normal; text-transform: uppercase; letter-spacing: 1px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .meta-group h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 10px 0; }
            .meta-group p { margin: 0 0 5px 0; font-size: 14px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 15px 0; border-bottom: 1px solid #eee; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
            td { padding: 15px 0; border-bottom: 1px solid #eee; font-size: 14px; }
            .price-col { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
            .total-row.final { border-top: 2px solid #000; margin-top: 10px; padding-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #999; }
            .paid-stamp { 
                position: absolute; top: 40px; right: 40px; 
                border: 2px solid #22c55e; color: #22c55e; 
                padding: 5px 15px; font-weight: bold; text-transform: uppercase; 
                letter-spacing: 2px; transform: rotate(-10deg);
                border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="paid-stamp">PAID</div>
          
          <div class="header">
            <h1>Goshen Store</h1>
            <h2>Official Receipt</h2>
          </div>
          
          <div class="meta">
            <div class="meta-group">
              <h3>Order Details</h3>
              <p>ID: ${order._id}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="meta-group">
              <h3>Billed To</h3>
              <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
              <p>${order.shippingAddress.email}</p>
              <p>${order.shippingAddress.phone}</p>
            </div>
          </div>
          
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th class="price-col">Price</th>
                <th class="price-col">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td class="price-col">$${item.price.toFixed(2)}</td>
                  <td class="price-col">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>$${(order.amount - 20).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Delivery Fee</span>
              <span>$20.00</span>
            </div>
            <div class="total-row final">
              <span>Total Paid</span>
              <span>$${order.amount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Goshen Store!</p>
            <p>${order.paymentMethod} Payment • Status: ${order.paymentStatus.toUpperCase()}</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
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

                                                <div className='mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-between'>
                                                    <div className='flex flex-wrap gap-4'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Payment: {order.paymentStatus}</p>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <div className={`w-2 h-2 rounded-full ${order.paymentMethod === 'COD' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                                                                Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' :
                                                                    order.paymentMethod?.includes('Stripe') || order.paymentMethod === 'stripe' ? 'Stripe' :
                                                                        order.paymentMethod || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {order.paymentStatus === 'paid' && (
                                                        <button
                                                            onClick={() => downloadReceipt(order)}
                                                            className='flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-lg shadow-black/5 hover:transform hover:-translate-y-0.5'
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                            <span className='text-[10px] font-black uppercase tracking-widest'>Download Receipt</span>
                                                        </button>
                                                    )}
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
