import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus } from "lucide-react";
import { getProductById, getReviews, addReview } from "../services/firebaseService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, userData } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([getProductById(id), getReviews(id)]).then(([p, r]) => {
        setProduct(p);
        setReviews(r);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success("Added to cart!");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    try {
      await addReview({
        productId: id,
        userId: user.uid,
        userName: userData?.name || user.email,
        ...newReview
      });
      toast.success("Review added!");
      setNewReview({ rating: 5, comment: "" });
      const updatedReviews = await getReviews(id!);
      setReviews(updatedReviews);
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading product...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover aspect-square"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= product.rating ? "fill-current" : "text-gray-200"}`} />
                ))}
                <span className="text-gray-500 font-bold ml-2">{product.rating} / 5</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-600 font-bold">{reviews.length} Customer Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-emerald-800">₹{product.price}</span>
            <span className="text-gray-400 font-medium">Inclusive of all taxes</span>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description || "Fresh, organic and directly sourced from local farms. Our products are grown without synthetic pesticides or fertilizers, ensuring the highest quality and nutritional value for your family."}
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-bold text-gray-400">
                {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-emerald-100 text-emerald-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-emerald-200 transition disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" /> 100% Quality
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="w-5 h-5 text-emerald-600 mr-2" /> Fast Delivery
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-emerald-600 mr-2" /> Easy Returns
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="pt-12 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-3xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: i })}
                        className={`p-1 transition ${i <= newReview.rating ? "text-amber-400" : "text-gray-300"}`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                  <textarea 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 min-h-30"
                    placeholder="Share your experience..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />
                </div>
                <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition">
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                        {review.userName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.userName}</h4>
                        <p className="text-xs text-gray-400">{new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "fill-current" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
