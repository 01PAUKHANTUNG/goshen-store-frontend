import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear local storage cart if any (Context usually handles this, but safety first)
        localStorage.removeItem("cart");
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-gray-100 text-center relative overflow-hidden"
            >
                {/* Decorative Gradient */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px]"></div>

                {/* Success Icon */}
                <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                    className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-black/10"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                    Welcome to <br /> the <span className="text-amber-500">Family.</span>
                </h1>

                <p className="text-gray-500 font-medium leading-relaxed mb-12">
                    Your order has been placed successfully. We're already picking the freshest items for your delivery!
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Track My Order
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-5 bg-gray-50 text-gray-400 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black hover:shadow-md transition-all"
                    >
                        Back to Shop
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Order confirmed & secured</p>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
