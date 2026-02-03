import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { ShopContext } from '../context/GoshenContext';
import axios from 'axios';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const session_id = params.get("session_id");
    const { backendUrl, token, setCartItems, delivery } = useContext(ShopContext);
    const [isVerifying, setIsVerifying] = useState(session_id ? true : false);
    const receiptRef = useRef(null);
    const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false);

    const location = useLocation();
    const [orderData, setOrderData] = useState(location.state?.order || null);

    // Load html2canvas from CDN
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.async = true;
        script.onload = () => setHtml2canvasLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!session_id) return;

            try {
                // Determine headers: include token if it exists
                const headers = token ? { token } : {};
                const response = await axios.post(backendUrl + '/api/order/verifyStripe', { session_id }, { headers });

                if (response.data.success) {
                    setCartItems([]);
                    // Clear guest cart as well
                    localStorage.removeItem('guestCart');
                    setOrderData(response.data.order);
                    navigate('/order-success', { replace: true, state: { order: response.data.order } });
                } else {
                    console.warn("Payment Verification Failed:", response.data.message);
                }
            } catch (error) {
                console.error("Verification Error:", error);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [token, session_id]);

    useEffect(() => {
        if (!session_id) {
            localStorage.removeItem("cart");
            localStorage.removeItem('guestCart');
        }
    }, [session_id]);

    const downloadReceipt = async () => {
        if (receiptRef.current && window.html2canvas) {
            try {
                const canvas = await window.html2canvas(receiptRef.current, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                });
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = image;
                link.download = `receipt-${orderData?._id || 'confirmed'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error("Receipt download failed", err);
            }
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            <motion.div
                ref={receiptRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-gray-100 text-center relative overflow-hidden receipt-container"
            >
                {/* Decorative Gradient */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] no-print" data-html2canvas-ignore="true"></div>

                {/* Success Icon */}
                <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                    className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-black/10 no-print"
                    data-html2canvas-ignore="true"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                    Order Confirmed!
                </h1>

                {orderData ? (
                    <div className="mb-10 text-left bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none">
                            <img src="/logo.jpg" alt="Goshen Logo" className="w-32 h-32 object-contain mb-2" />
                            <p className="text-4xl font-black tracking-wider">GOSHEN STORE</p>
                        </div>


                        {orderData.paymentMethod !== 'COD' ? (
                            <p className="text-center text-gray-500 font-medium mb-6 uppercase tracking-widest text-xs relative z-10">Official Receipt</p>
                        ) : (
                            <p className="text-center text-amber-600 font-bold mb-6 uppercase tracking-widest text-xs relative z-10 px-4">
                                A receipt will be sent to your email address once your order is delivered.
                            </p>
                        )}
                        <div className="space-y-4 text-sm text-gray-800 relative z-10">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-bold">Order ID:</span>
                                <span className="font-mono text-xs">{orderData._id}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-bold">Date:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-bold">Payment Method:</span>
                                <span className="uppercase font-mono">{orderData.paymentMethod}</span>
                            </div>

                            {/* Order Items Section */}
                            {orderData.items && orderData.items.length > 0 && (
                                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                                    <p className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-3">Order Items</p>
                                    <div className="space-y-2">
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-start text-xs">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                                    <p className="text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                </div>
                                                <span className="font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delivery Fee */}
                            <div className="flex justify-between pt-3 border-t border-gray-200">
                                <span className="font-semibold text-sm">Delivery Fee:</span>
                                <span className="font-semibold text-sm">
                                    ${Number(orderData?.deliveryFee !== undefined ? orderData.deliveryFee : delivery).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between pt-4 mt-4 border-t-2 border-gray-300">
                                <span className="font-black text-lg">Total Amount:</span>
                                <span className="font-black text-lg">${orderData.amount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-[10px] text-gray-400 no-print" data-html2canvas-ignore="true">
                            <p>Thank you for shopping with Goshen.</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 font-medium leading-relaxed mb-12">
                        Your order has been placed successfully. We're already picking the freshest items for your delivery!
                    </p>
                )}

                <div className="flex flex-col gap-4 no-print" data-html2canvas-ignore="true">
                    {orderData && orderData.paymentMethod !== 'COD' && (
                        <button
                            onClick={downloadReceipt}
                            className="w-full py-4 bg-amber-500 text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Receipt
                        </button>
                    )}

                    {token && (
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Track My Order
                        </button>
                    )}
                    <button
                        onClick={() => navigate("/")}
                        className={`w-full py-5 ${token ? 'bg-gray-50 text-gray-400' : 'bg-black text-white shadow-xl shadow-black/10'} rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black hover:shadow-md transition-all`}
                    >
                        {token ? 'Back to Shop' : 'Continue Shopping'}
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 no-print">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Order confirmed & secured</p>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
