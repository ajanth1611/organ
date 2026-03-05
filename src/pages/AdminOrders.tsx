import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";
import { Search, Filter, Eye, CheckCircle, Clock, Truck } from "lucide-react";
import { motion } from "motion/react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {["All", "Pending", "Processing", "Delivered"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                filter === f ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm font-bold text-gray-900">{order.products?.length} Items</p>
                      <p className="text-[10px] text-gray-400">{new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{order.address?.city}</p>
                      <p className="text-gray-500">{order.address?.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-emerald-700">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : 
                      order.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {order.status === "Pending" && (
                        <button 
                          onClick={() => updateStatus(order.id, "Processing")}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Process Order"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === "Processing" && (
                        <button 
                          onClick={() => updateStatus(order.id, "Delivered")}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
                          title="Mark as Delivered"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
