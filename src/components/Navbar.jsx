import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link, NavLink } from 'react-router'
import logo from '../assets/logo.jpg'
import search from '../assets/icon/search.png'
import account from '../assets/icon/account.png'
import trolley from '../assets/icon/trolley.png'
import humbagar from '../assets/icon/menu.png'
import dropdown from '../assets/icon/dropdown.png'
import { ShopContext } from '../context/GoshenContext'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

const Navbar = () => {
  const { getItemCount, getCartTotal, currency, products, token, setToken, navigate, setCartItems, backendUrl } = useContext(ShopContext)
  const [subMenu, setSubmenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [productData, setProductData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadInquiries = async () => {
    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/contact/user-inquiries', {}, { headers: { token } });
        if (response.data.success) {
          const unread = response.data.messages.filter(m => !m.isRead && m.status === 'replied').length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadInquiries();
    // Refresh unread count every 30 seconds for real-time feel
    const interval = setInterval(fetchUnreadInquiries, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value.trim() === "") {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const term = value.toLowerCase();
    const result = productData.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const sub = (item.subCategory || "").toLowerCase();
      return cat.includes(term) || desc.includes(term) || sub.includes(term);
    });

    setFiltered(result);
    setShowDropdown(true);
  };

  const loginState = async () => {
    if (!token) {
      navigate('/login')
    } else {
      localStorage.removeItem('token')
      setToken('')
      setCartItems([])
      setUnreadCount(0)
      navigate('/login')
    }
  }

  useEffect(() => {
    setProductData(products.filter((item) => item.stockAvaiable === true))
    const handleScroll = () => {
      if (window.scrollY > 80 && !isScrolled) setIsScrolled(true);
      if (window.scrollY < 20 && isScrolled) setIsScrolled(false);
    };
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [products, isScrolled]);

  return (
    <LayoutGroup>
      <div
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'glass-effect shadow-xl py-2 md:py-3' : 'bg-white py-0 border-b border-gray-100'
          }`}
      >
        <div className='max-w-[1440px] mx-auto px-4 md:px-12'>
          <div className='flex flex-col relative'>

            {/* TOP ROW */}
            <AnimatePresence initial={false}>
              {!isScrolled && (
                <motion.div
                  key="top-header"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='flex items-center justify-between gap-4 md:gap-8 py-4'
                >
                  <motion.div layoutId="logo-box" className='shrink-0'>
                    <Link to='/'>
                      <img className='w-20 md:w-28 transition-transform hover:scale-105' src={logo} alt='logo' />
                    </Link>
                  </motion.div>

                  <motion.div layoutId="search-box" className='flex-1 max-w-2xl hidden md:block relative overflow-visible'>
                    <div ref={wrapperRef} className='flex items-center gap-3 bg-gray-100/50 rounded-full px-6 py-3 border border-transparent focus-within:border-black/10 focus-within:bg-white focus-within:shadow-lg transition-all'>
                      <img src={search} className='w-5 opacity-40' alt='' />
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search products..."
                        className="bg-transparent border-none outline-none w-full text-sm font-medium"
                      />
                    </div>
                    {showDropdown && filtered.length > 0 && (
                      <ul className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl max-h-[60vh] overflow-y-auto z-[100] p-4 space-y-2">
                        {filtered.map((item) => (
                          <li key={item._id} onClick={() => { setShowDropdown(false); setSearchText("") }} className="hover:bg-gray-50 rounded-2xl p-3 transition-colors">
                            <Link to={`/product/${item._id}`} className="flex items-center gap-4">
                              <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-gray-50" alt='' />
                              <div className='text-left'>
                                <p className='font-bold text-gray-900 leading-tight text-sm'>{item.description}</p>
                                <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1'>{item.category}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>

                  <div className='hidden md:flex items-center gap-3 shrink-0'>
                    <div
                      className='relative group flex items-center'
                      onMouseEnter={() => setShowProfileMenu(true)}
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <motion.div layoutId="auth-btn-box">
                        <button onClick={!token ? loginState : null} className='flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 font-bold text-xs hover:border-black whitespace-nowrap bg-white relative'>
                          {token ? 'Account' : 'Login'}
                          {token && <img src={dropdown} className='w-2 opacity-40' alt='' />}
                          {unreadCount > 0 && (
                            <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse'></span>
                          )}
                        </button>
                      </motion.div>

                      {/* Desktop Account Menu */}
                      <AnimatePresence>
                        {token && showProfileMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className='absolute top-full right-0 pt-3 w-48 z-[110]'
                          >
                            <div className='bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 overflow-hidden'>
                              <Link to='/orders' className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors'>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                <span className='text-[10px] font-black uppercase tracking-widest text-gray-600'>My Orders</span>
                              </Link>
                              <Link to='/my-inquiries' className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors'>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                <span className='text-[10px] font-black uppercase tracking-widest text-gray-600'>My Inquiries</span>
                              </Link>
                              <button onClick={loginState} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left group'>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                <span className='text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-red-600'>Logout</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div layoutId="cart-btn-box">
                      <Link to='/cart' className='flex items-center gap-3 px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs shadow-lg shadow-black/10 whitespace-nowrap hover:scale-105 transition-transform'>
                        <img src={trolley} className='w-4 brightness-0 invert' alt='' />
                        {currency}{getCartTotal()} <span className='opacity-40'>({getItemCount()})</span>
                      </Link>
                    </motion.div>
                  </div>

                  <div className='md:hidden flex items-center gap-3'>
                    <button onClick={() => setMobileSearch(!mobileSearch)} className='p-2 bg-gray-100 rounded-full'>
                      <img src={search} className='w-5 opacity-60' alt='' />
                    </button>
                    <button onClick={() => setShowMenu(true)} className='p-2'>
                      <img src={humbagar} className='w-8' alt='' />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NAV BAR */}
            <div className={`flex items-center justify-between py-2 transition-all duration-300 ${isScrolled ? '' : 'border-t border-gray-50 mt-1 pt-2'}`}>
              <div className='flex items-center gap-2 flex-1'>
                <div className='flex items-center'>
                  <AnimatePresence>
                    {isScrolled && (
                      <motion.div
                        layoutId="logo-box"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='mr-4 shrink-0'
                      >
                        <Link to='/'>
                          <img className='w-12 md:w-14' src={logo} alt='' />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isScrolled && (
                    <button onClick={() => setShowMenu(true)} className='md:hidden p-2 mr-2 bg-black rounded-lg'>
                      <img src={humbagar} className='w-6 brightness-0 invert' alt='' />
                    </button>
                  )}
                </div>

                <nav className='hidden md:flex items-center gap-1 shrink-0'>
                  <NavLink to='/' className={({ isActive }) => `px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-black'}`}>Home</NavLink>
                  <NavLink to='/about-us' className={({ isActive }) => `px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-black'}`}>About</NavLink>

                  <div className='relative group' onMouseEnter={() => setSubmenu(true)} onMouseLeave={() => setSubmenu(false)}>
                    <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${subMenu ? 'bg-gray-100 text-black' : 'text-gray-400'}`}>
                      Products <img src={dropdown} className={`w-3 opacity-40 transition-transform ${subMenu ? 'rotate-180' : ''}`} alt='' />
                    </button>
                    {subMenu && (
                      <div className='absolute left-0 top-full pt-3 w-[800px] z-50'>
                        <div className='bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300'>
                          {[
                            { to: '/groceries', label: 'Groceries', desc: 'Fresh pantry essentials' },
                            { to: '/beauti&cosmetics', label: 'Beauty & Care', desc: 'Skincare and cosmetics' },
                            { to: '/vegetables&fruits', label: 'Fresh Produce', desc: 'Farm-to-table veggies' },
                            { to: '/snacks&drinks', label: 'Snacks & Drinks', desc: 'Cold beverages and treats' },
                            { to: '/homewares', label: 'Homewares', desc: 'Everything for your home' },
                            { to: '/books&stationery', label: 'Stationery', desc: 'Writing tools and supplies' },
                          ].map((item) => (
                            <NavLink key={item.to} to={item.to} className='group/item p-4 rounded-2xl hover:bg-gray-50 transition-all'>
                              <p className='font-black text-gray-900 mb-1 group-hover/item:text-amber-600 transition-colors uppercase text-[10px] tracking-widest text-left'>{item.label}</p>
                              <p className='text-[10px] text-gray-400 leading-tight font-medium text-left'>{item.desc}</p>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <NavLink to='/contact-us' className={({ isActive }) => `px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-black'}`}>Contact</NavLink>
                </nav>

                <AnimatePresence>
                  {isScrolled && (
                    <motion.div
                      layoutId="search-box"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '300px' }}
                      exit={{ opacity: 0, width: 0 }}
                      className='hidden lg:block ml-8 flex-1 max-w-sm relative overflow-visible'
                    >
                      <div ref={wrapperRef} className='flex items-center gap-3 bg-gray-100/50 rounded-full px-5 py-2 border border-black/5 focus-within:bg-white focus-within:shadow-md transition-all'>
                        <img src={search} className='w-4 opacity-40' alt='' />
                        <input
                          type="text"
                          value={searchText}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search..."
                          className="bg-transparent border-none outline-none w-full text-xs font-bold"
                        />
                      </div>
                      {showDropdown && filtered.length > 0 && (
                        <ul className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3 space-y-1 z-[100]">
                          {filtered.slice(0, 5).map((item) => (
                            <li key={item._id} onClick={() => { setShowDropdown(false); setSearchText("") }} className="hover:bg-gray-50 rounded-xl p-2 transition-colors">
                              <Link to={`/product/${item._id}`} className="flex items-center gap-3">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt='' />
                                <p className='font-bold text-gray-900 text-[10px] leading-tight truncate text-left'>{item.description}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='flex items-center gap-2 md:gap-3 shrink-0'>
                {isScrolled && (
                  <button onClick={() => setMobileSearch(!mobileSearch)} className='md:hidden p-2.5 bg-gray-100 rounded-full'>
                    <img src={search} className='w-4 opacity-60' alt='' />
                  </button>
                )}
                <AnimatePresence mode='wait'>
                  {isScrolled ? (
                    <div className='flex items-center gap-2' key="scrolled-actions">
                      <div
                        className='relative'
                        onMouseEnter={() => setShowProfileMenu(true)}
                        onMouseLeave={() => setShowProfileMenu(false)}
                      >
                        <motion.div layoutId="auth-btn-box">
                          <button onClick={!token ? loginState : null} className='p-2.5 border border-gray-100 rounded-full hover:border-black bg-white shadow-sm relative'>
                            <img src={account} className='w-4 opacity-60' alt='' />
                            {unreadCount > 0 && (
                              <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white'></span>
                            )}
                          </button>
                        </motion.div>

                        {/* Scrolled Account Menu */}
                        <AnimatePresence>
                          {token && showProfileMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className='absolute top-full right-0 pt-3 w-48 z-[110]'
                            >
                              <div className='bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 overflow-hidden'>
                                <Link to='/orders' className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors'>
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                  <span className='text-[10px] font-black uppercase tracking-widest text-gray-600'>My Orders</span>
                                </Link>
                                <Link to='/my-inquiries' className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors'>
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                  <span className='text-[10px] font-black uppercase tracking-widest text-gray-600'>My Inquiries</span>
                                  {unreadCount > 0 && (
                                    <span className='ml-auto bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center'>{unreadCount}</span>
                                  )}
                                </Link>
                                <button onClick={loginState} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left group'>
                                  <svg className="w-4 h-4 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                  <span className='text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-red-600'>Logout</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.div layoutId="cart-btn-box">
                        <Link to='/cart' className='p-2.5 bg-black rounded-full shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center min-w-[40px] min-h-[40px]'>
                          <img src={trolley} className='w-4 brightness-0 invert' alt='' />
                          {getItemCount() > 0 && <span className='ml-1 text-[10px] text-white font-black'>{getItemCount()}</span>}
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      key="store-status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='hidden md:flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest'
                    >
                      <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
                      Ringwood OPEN
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* MOBILE FULL-SCREEN SEARCH */}
        <AnimatePresence>
          {mobileSearch && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='fixed inset-0 bg-white z-[110] p-6'>
              <div className='flex items-center gap-4 mb-8'>
                <div className='flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-6 py-4'>
                  <img src={search} className='w-5 opacity-40' alt='' />
                  <input autoFocus type="text" value={searchText} onChange={(e) => handleSearch(e.target.value)} placeholder="Search Goshen Store..." className="bg-transparent border-none outline-none w-full font-bold" />
                </div>
                <button onClick={() => { setMobileSearch(false); setSearchText(""); setShowDropdown(false) }} className='text-gray-400 font-bold'>Cancel</button>
              </div>
              <div className='overflow-y-auto max-h-[70vh]'>
                {filtered.map(item => (
                  <Link key={item._id} to={`/product/${item._id}`} onClick={() => { setMobileSearch(false); setSearchText(""); setShowDropdown(false) }} className='flex items-center gap-4 p-4 border-b border-gray-50'>
                    <img src={item.image} className='w-16 h-16 rounded-xl object-cover bg-gray-50' alt='' />
                    <div>
                      <p className='font-black text-gray-900 leading-tight'>{item.description}</p>
                      <p className='text-xs text-amber-600 font-bold uppercase mt-1'>{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE SIDEBAR MENU */}
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMenu(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]' />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className='fixed top-0 right-0 w-[85%] max-w-sm h-screen bg-white z-[160] p-10 flex flex-col shadow-2xl overflow-y-auto'
              >
                <div className='flex justify-between items-center mb-16'>
                  <img className='w-24' src={logo} alt='' />
                  <button onClick={() => setShowMenu(false)} className='w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all'>
                    <span className='text-3xl font-light'>×</span>
                  </button>
                </div>

                <div className='flex flex-col gap-8'>
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'About', path: '/about-us' },
                    { label: 'Contact', path: '/contact-us' },
                  ].map((item) => (
                    <NavLink key={item.label} to={item.path} onClick={() => setShowMenu(false)} className={({ isActive }) => `text-4xl font-black tracking-tighter transition-colors ${isActive ? 'text-amber-500' : 'text-gray-900 hover:text-amber-500'}`}>{item.label}</NavLink>
                  ))}

                  <div className='h-px bg-gray-100 my-4'></div>

                  {token && (
                    <div className='flex flex-col gap-6'>
                      <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Your Account</p>
                      <Link to='/orders' onClick={() => setShowMenu(false)} className='flex items-center gap-4 group'>
                        <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <span className='text-xl font-bold text-gray-900'>My Orders</span>
                      </Link>
                      <Link to='/my-inquiries' onClick={() => setShowMenu(false)} className='flex items-center gap-4 group'>
                        <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all relative'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                          {unreadCount > 0 && <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse'></span>}
                        </div>
                        <span className='text-xl font-bold text-gray-900'>My Inquiries</span>
                        {unreadCount > 0 && <span className='ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg'>{unreadCount} NEW</span>}
                      </Link>
                      <div className='h-px bg-gray-100 my-4'></div>
                    </div>
                  )}

                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Our Marketplace</p>
                  <div className='grid grid-cols-1 gap-4'>
                    {['Groceries', 'Beauty', 'Produce', 'Snacks', 'Homewares'].map((cat) => (
                      <NavLink key={cat} to={`/${cat.toLowerCase().replace(' ', '&')}`} onClick={() => setShowMenu(false)} className='text-lg font-bold text-gray-500 hover:text-black transition-colors'>{cat}</NavLink>
                    ))}
                  </div>

                  <div className='mt-auto pt-10 flex flex-col gap-4'>
                    <button onClick={() => { loginState(); setShowMenu(false) }} className='w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all'>
                      {token ? 'Log out' : 'Account Login'}
                    </button>
                    <Link to='/cart' onClick={() => setShowMenu(false)} className='w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs text-center shadow-xl shadow-black/10'>
                      View Basket ({getItemCount()})
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

export default Navbar
