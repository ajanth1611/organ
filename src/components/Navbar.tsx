import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Search, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-emerald-800 tracking-tight">Organova</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium transition">Shop</Link>
            {userData?.role === "admin" && (
              <Link to="/admin" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">Admin</Link>
            )}
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                      {userData?.name?.[0] || user.email?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">{userData?.name || "User"}</span>
                  </div>
                  <button 
                    onClick={() => logout().then(() => navigate("/login"))}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-700 transition shadow-md shadow-emerald-200">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <Link to="/products" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/cart" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
          {userData?.role === "admin" && (
            <Link to="/admin" className="block text-emerald-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {user ? (
            <button 
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="block w-full text-left text-red-500 font-medium"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="block bg-emerald-600 text-white text-center py-2 rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
