import React from 'react'
import { Link } from 'react-router'
import logo from '../assets/logo.jpg'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to='/' className="block">
              <img src={logo} alt="Goshen Store" className="w-24 grayscale hover:grayscale-0 transition-all duration-500" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your one-stop premium destination for fresh produce, groceries, beauty products, and daily essentials. Quality you can trust, delivered.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/goshenstoreringwood?__cft__[0]=AZVj-Q_7Ko9_mMKs-zrTL2JwvqednWdjZtE67oZfLC_yqCpIuORxqKtpr1rbshik_SNLpJg4Cyr75CP47Akl6i9qnTD63gK4eJLWm7FMgLXSVZR-kddwB7E_wDnsJcfZgXC2Vaxx2FHfLuriyxExuT7dMamUk-GmIqvoDa7Ib4bv_vpRyEkRfZY-seXTbhFrfoM&__tn__=-UC%2CP-R" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300 group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all duration-300 group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.047-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.483 2.93c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Company</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Discovery</h3>
            <ul className="space-y-4">
              {['Groceries', 'Vegetables', 'Fruits', 'Beauty & Cosmetics', 'Best Sellers'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                  <a href="mailto:goshenstore20@gmail.com" className="text-sm font-bold text-gray-900 hover:text-amber-600">goshenstore20@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                  <a href="tel:+61470499780" className="text-sm font-bold text-gray-900 hover:text-amber-600">+61 470 499 780</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Location</span>
                  <p className="text-sm font-medium text-gray-900">2C Station St, Ringwood<br />Melbourne, VIC, Australia</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-gray-400 text-center md:text-left">
            Copyright &copy; {new Date().getFullYear()} Goshen Store. All Rights Reserved.
          </p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple payment icons placeholder using text for now if assets missing, or just a small sleek label */}
            <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
