import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/GoshenContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Inquiries = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserInquiries = async () => {
        const storedToken = token || localStorage.getItem('token');
        if (!storedToken) return;

        try {
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/contact/user-inquiries', {}, { headers: { token: storedToken } });
            if (response.data.success) {
                setMessages(response.data.messages);

                // Mark unread replies as read
                const unreadReplies = response.data.messages.filter(m => !m.isRead && m.status === 'replied');
                if (unreadReplies.length > 0) {
                    unreadReplies.forEach(m => {
                        axios.post(backendUrl + '/api/contact/mark-read', { id: m._id }, { headers: { token: storedToken } });
                    });
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            const storedToken = token || localStorage.getItem('token');
            if (!storedToken) {
                navigate('/login');
            } else {
                fetchUserInquiries();
            }
        };
        checkAuth();
    }, [token]);

    return (
        <div className='min-h-screen bg-[#f8f9fa] py-12 md:py-20'>
            <div className='max-w-[1440px] mx-auto px-6 md:px-12'>

                <div className='mb-12'>
                    <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2'>My Inquiries.</h1>
                    <p className='text-gray-500 font-medium'>Track your questions and stay updated on admin responses.</p>
                </div>

                {loading ? (
                    <div className='py-20 flex justify-center'>
                        <div className='w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : messages.length > 0 ? (
                    <div className='grid grid-cols-1 gap-8'>
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className='bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm overflow-hidden relative'
                                >
                                    <div className='flex flex-wrap justify-between items-start gap-6 mb-8'>
                                        <div>
                                            <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${msg.status === 'replied' ? 'bg-green-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                                                {msg.status === 'replied' ? 'Admin Responded' : 'Pending Review'}
                                            </span>
                                            {!msg.isRead && msg.status === 'replied' && (
                                                <span className='ml-2 inline-block px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-md animate-bounce'>New!</span>
                                            )}
                                            <h3 className='text-2xl font-black text-gray-900 leading-tight'>{msg.subject}</h3>
                                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-1'>
                                                Sent on {new Date(msg.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className='bg-gray-50 px-4 py-2 rounded-xl border border-gray-100'>
                                            <p className='text-[10px] font-black text-gray-300 uppercase tracking-widest'>ID Reference</p>
                                            <p className='text-[10px] font-mono text-gray-400'>{msg._id}</p>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
                                        <div className='bg-gray-50/50 p-6 rounded-3xl border border-gray-50'>
                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1'>Your Message</p>
                                            <p className='text-gray-600 font-medium leading-relaxed'>{msg.message}</p>
                                        </div>

                                        {msg.reply ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className='bg-black p-8 rounded-3xl border border-black shadow-xl relative'
                                            >
                                                <div className='absolute -top-3 -left-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white'>
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                                </div>
                                                <p className='text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4'>Official Response</p>
                                                <p className='text-white font-black italic text-lg leading-relaxed'>"{msg.reply}"</p>
                                                <div className='mt-6 pt-6 border-t border-white/10 flex items-center gap-2'>
                                                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
                                                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Helpful Team @ Goshen Store</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className='flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-3xl opacity-50 text-center fill-gray-200'>
                                                <svg className="w-10 h-10 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0y"></path></svg>
                                                <p className='text-[10px] font-black text-gray-300 uppercase tracking-widest'>Waiting for Admin to reply...</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-gray-100'>
                        <div className='w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-200'>
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        </div>
                        <h3 className='text-2xl font-black text-gray-300 uppercase tracking-widest mb-2'>No inquiries found</h3>
                        <p className='text-gray-400 font-medium mb-10'>Have a question? We're always here to help.</p>
                        <button onClick={() => navigate('/contact-us')} className='px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all'>
                            Contact Us Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inquiries;
