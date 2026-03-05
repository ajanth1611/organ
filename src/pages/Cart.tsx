import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "motion/react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Start shopping for fresh organic groceries!</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-emerald-600 font-bold mt-1">₹{item.price}</p>
                
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-xl p-0.5 bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                <p className="text-xl font-black text-emerald-800">₹{item.price * item.quantity}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST 5%)</span>
                <span className="font-bold">₹{Math.round(total * 0.05)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-3xl font-black text-emerald-700">₹{total + Math.round(total * 0.05)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <p className="text-center text-xs text-gray-400">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
