import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "motion/react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    stock: number;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold text-gray-500 ml-1">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-gray-800 font-bold text-lg leading-tight hover:text-emerald-600 transition truncate">{product.name}</h3>
        </Link>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-emerald-700 font-extrabold text-xl">₹{product.price}</span>
            <span className="text-gray-400 text-xs ml-1">/ unit</span>
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all ${
              product.stock > 0 
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
