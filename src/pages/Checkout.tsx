import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/firebaseService";
import { toast } from "react-hot-toast";
import { CreditCard, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  const finalTotal = total + Math.round(total * 0.05);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const response = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      const orderData = await response.json();

      // 2. Open Razorpay
      const options = {
        key: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Organova",
        description: "Organic Grocery Purchase",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Save order to Firestore
          await createOrder({
            userId: user?.uid,
            products: cart,
            total: finalTotal,
            address,
            paymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          });
          
          toast.success("Payment Successful!");
          clearCart();
          setStep(3);
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: address.phone
        },
        theme: { color: "#059669" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
              step >= i ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
            </div>
            {i < 3 && <div className={`w-20 h-1 mx-2 rounded ${step > i ? "bg-emerald-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center"><MapPin className="mr-2 text-emerald-600" /> Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Street Address" 
                className="col-span-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={address.street}
                onChange={(e) => setAddress({...address, street: e.target.value})}
              />
              <input 
                placeholder="City" 
                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
              />
              <input 
                placeholder="State" 
                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value})}
              />
              <input 
                placeholder="ZIP Code" 
                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={address.zip}
                onChange={(e) => setAddress({...address, zip: e.target.value})}
              />
              <input 
                placeholder="Phone Number" 
                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={address.phone}
                onChange={(e) => setAddress({...address, phone: e.target.value})}
              />
            </div>
            <button 
              onClick={() => {
                if (!address.street || !address.city || !address.phone) {
                  toast.error("Please fill in all required fields");
                  return;
                }
                setStep(2);
              }}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition"
            >
              Continue to Payment
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8"
          >
            <h2 className="text-2xl font-bold flex items-center"><CreditCard className="mr-2 text-emerald-600" /> Payment Selection</h2>
            
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-emerald-800 font-bold">Order Total</span>
                <span className="text-2xl font-black text-emerald-900">₹{finalTotal}</span>
              </div>
              <p className="text-emerald-600 text-sm">Secure payment via Razorpay. Supports UPI, Cards, and Netbanking.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Pay Now with Razorpay"}
              </button>
              <button 
                onClick={() => setStep(1)}
                className="w-full text-gray-500 font-bold hover:underline"
              >
                Back to Address
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-black text-gray-900">Order Placed Successfully!</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Thank you for shopping with Organova. Your fresh groceries will be delivered to you shortly.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-200"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
