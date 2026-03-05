import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-emerald-800 tracking-tight">Organova</span>
          </Link>
          <p className="text-gray-500 leading-relaxed">
            Your premium destination for fresh, organic, and locally sourced groceries. We believe in healthy living and sustainable farming.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 font-medium">
            <li><Link to="/products" className="hover:text-emerald-600 transition">Shop All</Link></li>
            <li><Link to="/cart" className="hover:text-emerald-600 transition">My Cart</Link></li>
            <li><Link to="/login" className="hover:text-emerald-600 transition">Account</Link></li>
            <li><a href="#" className="hover:text-emerald-600 transition">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-6">Categories</h4>
          <ul className="space-y-4 text-gray-500 font-medium">
            <li><Link to="/products" className="hover:text-emerald-600 transition">Vegetables</Link></li>
            <li><Link to="/products" className="hover:text-emerald-600 transition">Fresh Fruits</Link></li>
            <li><Link to="/products" className="hover:text-emerald-600 transition">Dairy & Eggs</Link></li>
            <li><Link to="/products" className="hover:text-emerald-600 transition">Bakery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-500 font-medium">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
              <span>123 Organic Lane, Green Valley, CA 90210</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
              <span>+1 (555) 000-1234</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
              <span>hello@organova.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-50 text-center text-gray-400 text-sm font-medium">
        <p>© {new Date().getFullYear()} Organova Organic Grocery. All rights reserved.</p>
      </div>
    </footer>
  );
}
