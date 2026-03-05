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

export const getProducts = async (category?: string) => {
  const productsRef = collection(db, "products");
  const q = category 
    ? query(productsRef, where("category", "==", category))
    : productsRef;
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id: string) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createOrder = async (orderData: any) => {
  const ordersRef = collection(db, "orders");
  const res = await addDoc(ordersRef, {
    ...orderData,
    createdAt: Timestamp.now(),
    status: "Pending"
  });

  // Reduce stock
  for (const item of orderData.products) {
    const productRef = doc(db, "products", item.id);
    await updateDoc(productRef, {
      stock: increment(-item.quantity)
    });
  }

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
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);
  if (!snapshot.empty) return; // Don't seed if already has data

  const sampleProducts = [
    {
      name: "Organic Spinach",
      category: "Vegetables",
      price: 45,
      stock: 50,
      rating: 4.8,
      description: "Fresh, nutrient-rich organic spinach leaves. Perfect for salads and smoothies.",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Red Gala Apples",
      category: "Fruits",
      price: 120,
      stock: 30,
      rating: 4.5,
      description: "Sweet and crunchy Gala apples, locally sourced from organic orchards.",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Farm Fresh Milk",
      category: "Dairy",
      price: 65,
      stock: 20,
      rating: 4.9,
      description: "Pure, pasteurized whole milk from grass-fed cows. No added preservatives.",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Artisan Sourdough",
      category: "Bakery",
      price: 85,
      stock: 15,
      rating: 4.7,
      description: "Traditional sourdough bread with a crispy crust and soft, airy interior.",
      image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Fresh Orange Juice",
      category: "Beverages",
      price: 150,
      stock: 25,
      rating: 4.6,
      description: "100% pure squeezed orange juice with pulp. Rich in Vitamin C.",
      image: "https://images.unsplash.com/photo-1600266177646-1f63d94b4661?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Organic Carrots",
      category: "Vegetables",
      price: 40,
      stock: 40,
      rating: 4.4,
      description: "Sweet and crunchy organic carrots, perfect for snacking or cooking.",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Greek Yogurt",
      category: "Dairy",
      price: 90,
      stock: 18,
      rating: 4.8,
      description: "Thick and creamy Greek style yogurt, high in protein and probiotics.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Roasted Almonds",
      category: "Snacks",
      price: 250,
      stock: 35,
      rating: 4.9,
      description: "Lightly salted, slow-roasted California almonds. A healthy energy boost.",
      image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Organic Blueberries",
      category: "Fruits",
      price: 180,
      stock: 25,
      rating: 4.9,
      description: "Plump and sweet organic blueberries, packed with antioxidants.",
      image: "https://images.unsplash.com/photo-1497534446932-c946e7316ba1?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Whole Grain Crackers",
      category: "Snacks",
      price: 75,
      stock: 45,
      rating: 4.3,
      description: "Crispy whole grain crackers with a hint of sea salt. Great with cheese.",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Organic Broccoli",
      category: "Vegetables",
      price: 55,
      stock: 30,
      rating: 4.7,
      description: "Fresh organic broccoli florets, high in fiber and vitamins.",
      image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&q=80&w=800"
    }
  ];

  for (const product of sampleProducts) {
    await addDoc(productsRef, product);
  }
};
