import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Users, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { getProducts } from "../services/firebaseService";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders, users] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "users"))
      ]);

      const totalRevenue = orders.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);

      setStats({
        products: products.size,
        orders: orders.size,
        users: users.size,
        revenue: totalRevenue
      });

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const recent = await getDocs(q);
      setRecentOrders(recent.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
        <Link to="/admin/products/new" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${stats.revenue}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Products", value: stats.products, icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Users", value: stats.users, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-emerald-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.address?.phone || "Guest"}</td>
                    <td className="px-6 py-4 font-black text-emerald-700">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-emerald-900 p-8 rounded-3xl text-white space-y-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/admin/products" className="w-full bg-emerald-800 p-4 rounded-2xl hover:bg-emerald-700 transition flex items-center">
              <Package className="w-5 h-5 mr-3" /> Manage Inventory
            </Link>
            <Link to="/admin/orders" className="w-full bg-emerald-800 p-4 rounded-2xl hover:bg-emerald-700 transition flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3" /> Process Orders
            </Link>
            <button className="w-full bg-emerald-800 p-4 rounded-2xl hover:bg-emerald-700 transition flex items-center">
              <TrendingUp className="w-5 h-5 mr-3" /> Sales Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
