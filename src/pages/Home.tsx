import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getProducts, seedProducts } from "../services/firebaseService";
import { motion } from "motion/react";

const categories = [
  { name: "Vegetables", icon: "🥬", color: "bg-green-100", textColor: "text-green-700" },
  { name: "Fruits", icon: "🍎", color: "bg-red-100", textColor: "text-red-700" },
  { name: "Dairy", icon: "🥛", color: "bg-blue-100", textColor: "text-blue-700" },
  { name: "Bakery", icon: "🍞", color: "bg-amber-100", textColor: "text-amber-700" },
  { name: "Beverages", icon: "🥤", color: "bg-purple-100", textColor: "text-purple-700" },
  { name: "Snacks", icon: "🥨", color: "bg-orange-100", textColor: "text-orange-700" },
];

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await seedProducts();
      const data = await getProducts();
      setPopularProducts(data.slice(0, 4));
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-3xl mx-4 mt-4">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920" 
          alt="Fresh Organic Grocery"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8 md:px-20">
          <div className="max-w-xl text-white space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase"
            >
              100% Organic & Fresh
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight"
            >
              Freshness Delivered <br /> <span className="text-emerald-400">To Your Door</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200"
            >
              Get the best organic vegetables, fruits, and daily essentials delivered within 15 minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/products" className="inline-flex items-center bg-white text-emerald-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition shadow-xl">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-emerald-600 font-bold flex items-center hover:underline">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              className={`${cat.color} rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-shadow hover:shadow-lg`}
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className={`font-bold ${cat.textColor}`}>{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
          <Link to="/products" className="text-emerald-600 font-bold flex items-center hover:underline">
            See More <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="bg-emerald-900 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              🚚
            </div>
            <h3 className="text-xl font-bold">Fast Delivery</h3>
            <p className="text-emerald-200">Get your groceries delivered in under 15 minutes.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              🌿
            </div>
            <h3 className="text-xl font-bold">100% Organic</h3>
            <p className="text-emerald-200">Directly sourced from certified organic farms.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              💳
            </div>
            <h3 className="text-xl font-bold">Secure Payment</h3>
            <p className="text-emerald-200">Safe and encrypted payments via Razorpay.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
