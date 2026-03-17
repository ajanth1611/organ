import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  increment
} from "firebase/firestore";
import { db } from "../firebase/config";
import { SAMPLE_PRODUCTS } from "../pages/sampleproducts";

export const getProducts = async (category?: string) => {
  let products = SAMPLE_PRODUCTS;
  if (category && category !== "All") {
    products = products.filter(p => p.category === category);
  }
  return products;
};

export const getProductById = async (id: string) => {
  return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
};

export const createOrder = async (orderData: any) => {
  const ordersRef = collection(db, "orders");
  const res = await addDoc(ordersRef, {
    ...orderData,
    createdAt: Timestamp.now(),
    status: "Pending"
  });

  // Note: Stock decrementing is disabled for local sample products
  return res.id;
};

export const getReviews = async (productId: string) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("productId", "==", productId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addReview = async (reviewData: any) => {
  const reviewsRef = collection(db, "reviews");
  return await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: Timestamp.now()
  });
};

export const seedProducts = async () => {
  // Seeding is now disabled as we use local SAMPLE_PRODUCTS
  return;
};
