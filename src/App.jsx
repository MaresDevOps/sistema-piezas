import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Hammer, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Calendar, 
  Sparkles, 
  X, 
  Wrench, 
  Compass, 
  Receipt,
  Download,
  Info,
  User,
  Lock,
  Mail,
  UserPlus,
  LogOut,
  ChevronDown,
  Clock,
  Database,
  Check,
  CreditCard,
  History,
  FileCheck,
  Printer
} from 'lucide-react';

// Import Firebase Services
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';

// ==========================================
// SEED DATA: 21 Premium Components
// ==========================================
const SEED_PRODUCTS = [
  // CPUs
  {
    id: 1,
    name: "AMD Ryzen 9 7950X3D",
    category: "CPU",
    price: 599.00,
    stock: 5,
    watts: 120,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    specs: "Gama Alta: 16 Cores / 32 Threads, 5.7GHz Boost, 144MB Cache, 3D V-Cache"
  },
  {
    id: 2,
    name: "Intel Core i7-14700K",
    category: "CPU",
    price: 389.00,
    stock: 12,
    watts: 125,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    specs: "Gama Media: 20 Cores / 28 Threads, up to 5.6GHz, LGA1700"
  },
  {
    id: 3,
    name: "AMD Ryzen 5 5600X",
    category: "CPU",
    price: 129.00,
    stock: 25,
    watts: 65,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    specs: "Gama Entrada: 6 Cores / 12 Threads, 4.6GHz Boost, PCIe 4.0, Socket AM4"
  },

  // GPUs
  {
    id: 4,
    name: "NVIDIA GeForce RTX 4090 Founders Edition",
    category: "GPU",
    price: 1599.00,
    stock: 2,
    watts: 450,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    specs: "Gama Alta: 24GB GDDR6X, DLSS 3, 16384 CUDA Cores, Ray Tracing Gen 3"
  },
  {
    id: 5,
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    price: 499.00,
    stock: 8,
    watts: 263,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    specs: "Gama Media: 16GB GDDR6, RDNA 3, AMD Infinity Cache, Ray Accelerator"
  },
  {
    id: 6,
    name: "NVIDIA GeForce RTX 3050",
    category: "GPU",
    price: 179.00,
    stock: 18,
    watts: 130,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    specs: "Gama Entrada: 8GB GDDR6, DLSS 2, 2560 CUDA Cores, Ray Tracing"
  },

  // Motherboards
  {
    id: 7,
    name: "ASUS ROG Strix X670E-E Gaming WiFi",
    category: "Motherboard",
    price: 439.00,
    stock: 8,
    watts: 50,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    specs: "Gama Alta: AM5, DDR5, PCIe 5.0, Wi-Fi 6E, Aura Sync RGB"
  },
  {
    id: 8,
    name: "MSI B650 GAMING PLUS WIFI",
    category: "Motherboard",
    price: 169.00,
    stock: 15,
    watts: 40,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    specs: "Gama Media: AM5, DDR5, Dual M.2 PCIe 4.0, Wi-Fi 6E, Core Boost"
  },
  {
    id: 9,
    name: "ASRock H610M-HVS",
    category: "Motherboard",
    price: 69.00,
    stock: 22,
    watts: 30,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    specs: "Gama Entrada: LGA1700, DDR4, PCIe 4.0, Micro ATX, SATA3"
  },

  // RAM
  {
    id: 10,
    name: "Corsair Vengeance RGB 64GB (2x32GB) DDR5 6400",
    category: "RAM",
    price: 219.00,
    stock: 10,
    watts: 15,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    specs: "Gama Alta: DDR5 CL32, Perfil Intel XMP 3.0, LEDs RGB Dinámicos"
  },
  {
    id: 11,
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000",
    category: "RAM",
    price: 119.00,
    stock: 20,
    watts: 10,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    specs: "Gama Media: DDR5 CL30, Perfiles AMD EXPO, Disipador Aluminio"
  },
  {
    id: 12,
    name: "Kingston FURY Beast 16GB (2x8GB) DDR4 3200",
    category: "RAM",
    price: 45.00,
    stock: 35,
    watts: 5,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    specs: "Gama Entrada: DDR4 CL16, Disipador de perfil bajo negro"
  },

  // Storage
  {
    id: 13,
    name: "Samsung 990 Pro 2TB NVMe M.2",
    category: "Storage",
    price: 179.00,
    stock: 25,
    watts: 10,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    specs: "Gama Alta: PCIe 4.0 NVMe, Lectura secuencial de hasta 7450 MB/s"
  },
  {
    id: 14,
    name: "Crucial P3 Plus 1TB PCIe M.2 SSD",
    category: "Storage",
    price: 69.00,
    stock: 40,
    watts: 7,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    specs: "Gama Media: PCIe Gen4 NVMe M.2, Lectura de hasta 5000 MB/s"
  },
  {
    id: 15,
    name: "Kingston A400 480GB SATA 2.5\"",
    category: "Storage",
    price: 29.00,
    stock: 50,
    watts: 4,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    specs: "Gama Entrada: Interfaz SATA III 6Gb/s, velocidad lectura de 500MB/s"
  },

  // PSUs
  {
    id: 16,
    name: "Corsair HX1200 1200W 80+ Platinum",
    category: "PSU",
    price: 249.00,
    stock: 6,
    watts: 1200,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    specs: "Gama Alta: Modulación Completa, Ventilador de Frecuencia Cero, 80 Plus Platinum"
  },
  {
    id: 17,
    name: "MSI MAG A750GL 750W 80+ Gold",
    category: "PSU",
    price: 89.00,
    stock: 18,
    watts: 750,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    specs: "Gama Media: Certificación Gold, Cables Planos, Ventilador FDB, ATX 3.0"
  },
  {
    id: 18,
    name: "EVGA 500 W1 500W 80+ White",
    category: "PSU",
    price: 45.00,
    stock: 30,
    watts: 500,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    specs: "Gama Entrada: 80 Plus Standard, Cables Con Malla, Ventilador de 120mm"
  },

  // Cases
  {
    id: 19,
    name: "Lian Li O11 Dynamic EVO RGB",
    category: "Case",
    price: 169.00,
    stock: 14,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    specs: "Gama Alta: Diseño Modular de Doble Cámara, Vidrio Templado Panorámico, Tiras ARGB"
  },
  {
    id: 20,
    name: "NZXT H5 Flow Mid-Tower Black",
    category: "Case",
    price: 89.00,
    stock: 22,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    specs: "Gama Media: Flujo de aire optimizado, Panel frontal perforado, Incluye ventilador angular"
  },
  {
    id: 21,
    name: "Corsair 3000D Airflow Black",
    category: "Case",
    price: 59.00,
    stock: 28,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    specs: "Gama Entrada: Panel frontal de acero de alta ventilación, Incluye 2 ventiladores SP120"
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState('catalogo');

  // Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [justAddedProduct, setJustAddedProduct] = useState(null);

  // Catalog
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // PC Builder
  const [builderSpecs, setBuilderSpecs] = useState({
    CPU: null,
    Motherboard: null,
    RAM: null,
    GPU: null,
    Storage: null,
    PSU: null,
    Case: null
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Orders and Tracking
  const [orders, setOrders] = useState([]);
  const [searchTrackingInput, setSearchTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [newOrderSuccess, setNewOrderSuccess] = useState(null);

  // Invoicing
  const [invoiceSearchCode, setInvoiceSearchCode] = useState('');
  const [invoiceSearchError, setInvoiceSearchError] = useState('');
  const [selectedOrderToBill, setSelectedOrderToBill] = useState(null);
  const [billingForm, setBillingForm] = useState({ rfc: '', razonSocial: '', cp: '', regimen: '601', usoCfdi: 'G03' });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  
  // Simulated QR pattern
  const [qrPattern] = useState(() => 
    Array.from({ length: 144 }).map((_, idx) => {
      const row = Math.floor(idx / 12);
      const col = idx % 12;
      if (row < 4 && col < 4) return (row === 0 || row === 3 || col === 0 || col === 3);
      if (row < 4 && col >= 8) return (row === 0 || row === 3 || col === 8 || col === 11);
      if (row >= 8 && col < 4) return (row === 8 || row === 11 || col === 0 || col === 3);
      return Math.sin(idx * 4.3) > 0;
    })
  );

  // ==========================================
  // FIRESTORE SEEDING & FETCHING
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          // No products in Firestore, let's seed them
          console.log("Seeding initial products to Firestore...");
          const batch = writeBatch(db);
          SEED_PRODUCTS.forEach((prod) => {
            const docRef = doc(collection(db, 'products'), prod.id.toString());
            batch.set(docRef, prod);
          });
          await batch.commit();
          setProducts(SEED_PRODUCTS);
        } else {
          const list = [];
          querySnapshot.forEach((docSnap) => {
            list.push(docSnap.data());
          });
          list.sort((a, b) => a.id - b.id);
          setProducts(list);
        }
      } catch (err) {
        console.error("Error loading products from Firestore:", err);
        // Fallback to local SEED_PRODUCTS if blocked by firewall/rules
        setProducts(SEED_PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // REAL AUTHENTICATION LISTENER
  // ==========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userProfile = {
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          username: firebaseUser.email.split('@')[0],
          rank: 'Rig Builder Rookie',
          avatarColor: 'from-purple-500 to-pink-500'
        };

        try {
          const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileSnap.exists()) {
            userProfile = profileSnap.data();
          } else {
            // Write default profile on first registration
            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
          }
        } catch (err) {
          console.error("Could not fetch user profile from Firestore:", err);
        }
        
        setCurrentUser({ ...userProfile, uid: firebaseUser.uid });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ==========================================
  // REAL-TIME ORDERS LISTENER (MIS COMPRAS)
  // ==========================================
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    const q = query(collection(db, 'orders'), where('buyerUid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList = [];
      querySnapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data());
      });
      ordersList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setOrders(ordersList);
    }, (err) => {
      console.error("Error subscribing to user orders:", err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // HMR timer for cart add animations
  useEffect(() => {
    if (justAddedProduct) {
      const timer = setTimeout(() => setJustAddedProduct(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [justAddedProduct]);

  // ==========================================
  // REGISTRATION & LOGIN SUBMISSIONS
  // ==========================================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      try {
        const emailToUse = authForm.email.includes('@') ? authForm.email : `${authForm.email}@nexus.com`;
        await signInWithEmailAndPassword(auth, emailToUse, authForm.password);
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', username: '', password: '' });
      } catch (err) {
        console.error(err);
        setAuthError('Correo o contraseña incorrectos.');
      }
    } else {
      // Register
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: authForm.name });

        const userProfile = {
          name: authForm.name,
          email: authForm.email,
          username: authForm.username || authForm.email.split('@')[0],
          rank: 'Rig Builder Rookie',
          avatarColor: 'from-purple-500 to-pink-500'
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', username: '', password: '' });
        alert("¡Cuenta registrada con éxito!");
      } catch (err) {
        console.error(err);
        setAuthError('Error al crear la cuenta: ' + err.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setShowProfileDropdown(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      if (!profileSnap.exists()) {
        const userProfile = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          username: user.email.split('@')[0],
          rank: 'Rig Builder Rookie',
          avatarColor: 'from-cyan-500 to-blue-500'
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      
      setShowAuthModal(false);
      setAuthForm({ name: '', email: '', username: '', password: '' });
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Error al iniciar sesión con Google: ' + err.message);
      }
    }
  };

  // ==========================================
  // CART HANDLERS
  // ==========================================
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setJustAddedProduct(product.id);
  };

  const updateCartQuantity = (productId, amount) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + amount;
        const product = products.find(p => p.id === productId);
        return newQty > 0 && newQty <= (product?.stock || 99)
          ? { ...item, quantity: newQty }
          : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // ==========================================
  // FIRESTORE ORDER SUBMISSION
  // ==========================================
  const handleCheckoutSuccess = async (e, checkoutForm) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Generate tracking code: NEX-XXXXXX
    const randomHex = Math.floor(16777215 + Math.random() * 8388607).toString(16).toUpperCase();
    const trackingCode = `NEX-${randomHex}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const newOrder = {
      id: trackingCode,
      buyerUid: currentUser.uid,
      buyerName: currentUser.name,
      email: currentUser.email,
      address: checkoutForm.address,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, category: item.category })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      createdAt: formattedDate,
      status: 1,
      history: [
        { step: 1, title: 'Pedido Recibido', desc: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.', time: formattedDate, location: 'Taller de Ensamblaje Central', completed: true },
        { step: 2, title: 'En Ensamblaje / Empaque', desc: 'Aún sin iniciar.', time: '--', location: '--', completed: false },
        { step: 3, title: 'En Tránsito', desc: 'Pendiente de recolección de transportista.', time: '--', location: '--', completed: false },
        { step: 4, title: 'Entregado', desc: 'Pendiente de envío.', time: '--', location: '--', completed: false }
      ]
    };

    try {
      // Write to Firestore orders collection
      await setDoc(doc(db, 'orders', trackingCode), newOrder);
      
      setCart([]);
      setShowCheckoutModal(false);
      setIsCartOpen(false);
      setNewOrderSuccess(newOrder);
    } catch (err) {
      console.error("Firestore order creation error:", err);
      alert("Error al procesar la orden en la base de datos.");
    }
  };

  // ==========================================
  // REAL-TIME TRACKING SUBSCRIBER
  // ==========================================
  const handleSearchTracking = (code = null) => {
    const targetCode = (code || searchTrackingInput).trim().toUpperCase();
    if (!targetCode) {
      setTrackingError("Introduce un número de guía para buscar.");
      setTrackingResult(null);
      return;
    }

    setTrackingError('');
    
    // Setup Firestore onSnapshot tracking listener
    const docRef = doc(db, 'orders', targetCode);
    
    if (window.activeTrackingListener) {
      window.activeTrackingListener();
    }

    window.activeTrackingListener = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTrackingResult(docSnap.data());
        setTrackingError('');
      } else {
        setTrackingError('Guía no registrada. Verifique el código de seguimiento.');
        setTrackingResult(null);
      }
    }, (err) => {
      console.error("Firestore tracking listener error:", err);
      setTrackingError('Error al conectar con la base de datos.');
      setTrackingResult(null);
    });
  };

  // ==========================================
  // INTRANET ORDER STATUS DISPATCHER
  // ==========================================
  const handleSimulateStatusChange = async (newStatus) => {
    if (!trackingResult) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const locations = {
      1: 'Taller de Ensamblaje Central',
      2: 'Taller de Calibración & Benchmarking',
      3: 'Centro de Clasificación Express DHL',
      4: 'Domicilio del Cliente'
    };

    const statusDescriptions = {
      1: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.',
      2: 'Hardware ensamblado y configurado. Pruebas de estrés superadas.',
      3: 'Paquete en tránsito vía aérea express a tu ciudad.',
      4: 'Entregado y recibido a conformidad del usuario.'
    };

    const updatedHistory = trackingResult.history.map(h => {
      if (h.step <= newStatus) {
        return {
          ...h,
          time: h.time === '--' ? formattedDate : h.time,
          location: h.location === '--' ? locations[h.step] : h.location,
          desc: statusDescriptions[h.step],
          completed: true
        };
      } else {
        return {
          ...h,
          time: '--',
          location: '--',
          completed: false
        };
      }
    });

    try {
      const docRef = doc(db, 'orders', trackingResult.id);
      await updateDoc(docRef, {
        status: newStatus,
        history: updatedHistory
      });
      // onSnapshot automatically updates trackingResult in client
    } catch (err) {
      console.error("Firestore status update error:", err);
      alert("Error al actualizar la orden en el servidor.");
    }
  };

  // ==========================================
  // FIRESTORE TAX INVOICE SEARCH
  // ==========================================
  const handleSearchOrderToBill = async (code = null) => {
    setInvoiceSearchError('');
    setGeneratedInvoice(null);
    const targetCode = (code || invoiceSearchCode).trim().toUpperCase();
    
    if (!targetCode) {
      setInvoiceSearchError('Por favor introduce un código de pedido.');
      setSelectedOrderToBill(null);
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, 'orders', targetCode));
      if (docSnap.exists()) {
        setSelectedOrderToBill(docSnap.data());
      } else {
        setInvoiceSearchError('El código de pedido no coincide con ningún registro.');
        setSelectedOrderToBill(null);
      }
    } catch (err) {
      console.error("Firestore invoice order lookup error:", err);
      setInvoiceSearchError('Error de red al consultar el pedido.');
      setSelectedOrderToBill(null);
    }
  };

  const handleGenerateCFDI = (e) => {
    e.preventDefault();
    if (!selectedOrderToBill) return;

    const randomUUID = () => {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
      return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    };

    const uuid = randomUUID();
    const now = new Date();
    const formattedCertTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const mockSello = "N3XU5Se11oD1g1ta1Em1s0rBase64==" + Math.floor(Math.random() * 1000000);
    const mockSelloSAT = "SATSe11oD1g1ta1Cert1f1cad0Base64==" + Math.floor(Math.random() * 1000000);
    const mockCadena = `||1.1|${uuid}|${formattedCertTime}|${mockSello}|00001000000504465028||`;

    const invoiceData = {
      uuid,
      certTime: formattedCertTime,
      selloEmisor: mockSello,
      selloSAT: mockSelloSAT,
      cadenaOriginal: mockCadena,
      rfcEmisor: "NEX260529HA1",
      razonSocialEmisor: "Nexus Hardware S.A. de C.V.",
      regimenEmisor: "601 - General de Ley Personas Morales",
      rfcReceptor: billingForm.rfc.toUpperCase(),
      razonSocialReceptor: billingForm.razonSocial.toUpperCase(),
      cpReceptor: billingForm.cp,
      regimenReceptor: billingForm.regimen,
      usoCfdi: billingForm.usoCfdi,
      order: selectedOrderToBill
    };

    setGeneratedInvoice(invoiceData);
  };

  // PC Builder specs total helper
  const activeSelectedParts = Object.values(builderSpecs).filter(p => p !== null);

  // Filters & Sorting list execution
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#94A3B8] relative overflow-hidden flex flex-col">
      {/* Glow shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* ==========================================
          HEADER / NAVBAR
          ========================================== */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalogo')}>
            <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-2.5 rounded-xl shadow-neon-cyan flex items-center justify-center">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white">NEXUS</span>
              <span className="text-xs font-semibold block text-cyan-400 tracking-widest mt-[-2px]">HARDWARE & LOGISTICS</span>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <button 
              onClick={() => setActiveTab('catalogo')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'catalogo' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Catálogo</span>
            </button>
            <button 
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'builder' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Hammer className="h-4 w-4" />
              <span>PC Builder</span>
            </button>
            <button 
              onClick={() => setActiveTab('rastreo')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'rastreo' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>Rastreo</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('facturacion');
                setSelectedOrderToBill(null);
                setGeneratedInvoice(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'facturacion' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>Facturación</span>
            </button>

            {/* User orders history link */}
            {currentUser && (
              <button 
                onClick={() => setActiveTab('orders-list')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'orders-list' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <History className="h-4 w-4" />
                <span>Mis Compras</span>
              </button>
            )}
          </nav>

          {/* User Section & Cart */}
          <div className="flex items-center space-x-3.5">
            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white transition-all group"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-[#0B0F19] shadow-neon-cyan">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border border-white/5 bg-[#151C2C]/60 hover:border-cyan-500/20 transition-all text-xs font-bold text-white cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${currentUser.avatarColor} flex items-center justify-center text-[10px] text-white font-extrabold uppercase shrink-0`}>
                    {currentUser.name[0]}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/5 bg-[#151C2C] p-2.5 shadow-2xl z-50 text-xs text-slate-300 animate-zoomIn">
                    <div className="p-2 border-b border-white/5 mb-2">
                      <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">{currentUser.rank}</span>
                      <span className="font-extrabold text-white text-sm block truncate">{currentUser.name}</span>
                      <span className="text-slate-500 block text-[10px] truncate">{currentUser.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('orders-list');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center space-x-2 text-slate-200 transition-colors"
                    >
                      <History className="h-4 w-4 text-cyan-500" />
                      <span>Mis Compras</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2 rounded-lg hover:bg-red-500/10 flex items-center space-x-2 text-red-400 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('login');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-neon-cyan hover:scale-[1.03] transition-all flex items-center space-x-1.5"
              >
                <User className="h-3.5 w-3.5" />
                <span>Ingresar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around mt-3.5 pt-3.5 border-t border-white/5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <button onClick={() => setActiveTab('catalogo')} className={`flex flex-col items-center space-y-1 w-full text-center ${activeTab === 'catalogo' ? 'text-cyan-400' : ''}`}><Compass className="h-4 w-4" /><span>Catálogo</span></button>
          <button onClick={() => setActiveTab('builder')} className={`flex flex-col items-center space-y-1 w-full text-center ${activeTab === 'builder' ? 'text-cyan-400' : ''}`}><Hammer className="h-4 w-4" /><span>PC Builder</span></button>
          <button onClick={() => setActiveTab('rastreo')} className={`flex flex-col items-center space-y-1 w-full text-center ${activeTab === 'rastreo' ? 'text-cyan-400' : ''}`}><Truck className="h-4 w-4" /><span>Rastreo</span></button>
          <button 
            onClick={() => {
              setActiveTab('facturacion');
              setSelectedOrderToBill(null);
              setGeneratedInvoice(null);
            }} 
            className={`flex flex-col items-center space-y-1 w-full text-center ${activeTab === 'facturacion' ? 'text-cyan-400' : ''}`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Factura</span>
          </button>
          {currentUser && (
            <button onClick={() => setActiveTab('orders-list')} className={`flex flex-col items-center space-y-1 w-full text-center ${activeTab === 'orders-list' ? 'text-cyan-400' : ''}`}><History className="h-4 w-4" /><span>Compras</span></button>
          )}
        </div>
      </header>

      {/* ==========================================
          MAIN AREA
          ========================================== */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 z-10">

        {/* ==========================================
            VIEW 1: PRODUCT CATALOGUE
            ========================================== */}
        {activeTab === 'catalogo' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Promotion Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/5 glass-panel p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none"></div>
              <div className="space-y-4 max-w-2xl">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3 mr-1.5" /> PRO HARDWARE STATION
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
                  FORJA TU <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 glow-cyan">SET-UP</span> DE ÚLTIMA GENERACIÓN
                </h1>
                <p className="text-slate-400 text-sm md:text-base">
                  Accede a componentes entusiastas de alta fidelidad. Selecciona tu combinación perfecta y monitorea el estado del ensamblado desde tu cuenta.
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-start md:justify-end">
                <button 
                  onClick={() => setActiveTab('builder')}
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-neon-purple hover:shadow-neon-cyan flex items-center space-x-2"
                >
                  <Hammer className="h-5 w-5" />
                  <span>Configurar PC Builder</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
                <Filter className="h-4 w-4 text-slate-500 shrink-0" />
                {['Todas', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                        : 'border-white/5 bg-white/5 hover:border-white/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'Todas' ? 'Todas las Categorías' : cat}
                  </button>
                ))}
              </div>

              {/* Search & Sorting inputs */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar hardware..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/5 bg-[#151C2C] text-white text-xs focus:border-cyan-500/40 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                <div className="relative w-full sm:w-auto flex items-center space-x-2 bg-[#151C2C] border border-white/5 rounded-xl px-3 py-2">
                  <ArrowUpDown className="h-4 w-4 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="default" className="bg-[#151C2C] text-slate-400">Por Defecto</option>
                    <option value="price-asc" className="bg-[#151C2C] text-slate-400">Precio: Menor a Mayor</option>
                    <option value="price-desc" className="bg-[#151C2C] text-slate-400">Precio: Mayor a Menor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {loadingProducts ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <span className="ml-3.5 text-slate-400 text-sm font-semibold uppercase tracking-wider">Conectando con base de datos real...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => {
                  const isJustAdded = justAddedProduct === product.id;
                  return (
                    <div 
                      key={product.id}
                      className="group relative rounded-2xl border border-white/5 bg-[#151C2C]/50 flex flex-col justify-between overflow-hidden glass-card"
                    >
                      {/* Image panel */}
                      <div className="h-48 w-full overflow-hidden relative bg-slate-950">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151C2C] to-transparent z-10"></div>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                        
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 bg-[#0B0F19]/80 backdrop-blur-md text-cyan-400 border border-cyan-500/20 text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider z-20">
                          {product.category}
                        </span>

                        {/* Stock Badge */}
                        <div className="absolute bottom-2 left-3 z-20">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            Stock: {product.stock} pz.
                          </span>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-white text-sm tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                            {product.specs}
                          </p>
                          <div className="flex gap-2">
                            {product.watts > 0 && (
                              <span className="inline-block text-[9px] text-slate-400 font-bold bg-slate-800/40 px-2 py-0.5 rounded">
                                {product.isPowerSupply ? `Potencia: ${product.watts}W` : `Consumo: ${product.watts}W`}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Cart button */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Precio</span>
                            <span className="text-lg font-black text-white">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                              isJustAdded 
                                ? 'bg-emerald-500 text-white shadow-neon-emerald' 
                                : 'bg-[#1e293b] text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 hover:shadow-neon-cyan hover:scale-[1.02]'
                            }`}
                          >
                            {isJustAdded ? <Check className="h-4.5 w-4.5 animate-bounce" /> : <Plus className="h-4.5 w-4.5" />}
                            <span>{isJustAdded ? 'Añadido' : 'Comprar'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl glass-panel">
                <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Sin resultados</h3>
                <p className="text-slate-500 text-xs mt-1">Intente buscar otro componente o cambie el filtro de categoría.</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 2: PC BUILDER WITH COMPATIBILITY
            ========================================== */}
        {activeTab === 'builder' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2.5">
                  <Hammer className="h-8 w-8 text-cyan-400" />
                  <span>INTEGRADOR PC BUILDER</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Combina hardware de diferentes gamas, comprueba la carga de watts del sistema y exporta una cotización formal.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearBuilder}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-white transition-all"
                >
                  Limpiar Rig
                </button>
                <button
                  onClick={addBuilderToCart}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center space-x-1.5"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Llevar Rig al Carrito</span>
                </button>
              </div>
            </div>

            {/* Builder Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Dropdowns builder fields */}
              <div className="lg:col-span-2 space-y-6">
                {[
                  { key: 'CPU', label: 'Procesador (CPU)', desc: 'Unidad de procesamiento central para lógica y cálculo' },
                  { key: 'Motherboard', label: 'Placa Base (Motherboard)', desc: 'Canales de comunicación y chipset principal' },
                  { key: 'RAM', label: 'Memoria RAM', desc: 'Acceso aleatorio de datos volátiles para el sistema' },
                  { key: 'GPU', label: 'Tarjeta de Video (GPU)', desc: 'Unidad de procesamiento de cálculo paralelo y vídeo' },
                  { key: 'Storage', label: 'Almacenamiento (M.2 NVMe)', desc: 'Dispositivo SSD para lectura y escritura' },
                  { key: 'PSU', label: 'Fuente de Alimentación (PSU)', desc: 'Transformador y distribuidor de corriente' },
                  { key: 'Case', label: 'Gabinete (Case)', desc: 'Chasis de soporte físico y montaje general' }
                ].map(item => {
                  const currentSelection = builderSpecs[item.key];
                  const options = products.filter(p => p.category === item.key);

                  return (
                    <div 
                      key={item.key}
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        currentSelection ? 'border-cyan-500/35 bg-[#151C2C]/50' : 'border-white/5 bg-[#151C2C]/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400">{item.key}</span>
                          <h3 className="font-extrabold text-white text-base">{item.label}</h3>
                          <p className="text-slate-500 text-xs leading-tight">{item.desc}</p>
                        </div>

                        {/* Select picker */}
                        <div className="w-full sm:w-80">
                          <select
                            value={currentSelection ? currentSelection.id : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                selectBuilderPart(item.key, null);
                              } else {
                                const match = products.find(p => p.id === parseInt(val));
                                selectBuilderPart(item.key, match);
                              }
                            }}
                            className="w-full px-3 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                          >
                            <option value="">-- Escoger {item.label} --</option>
                            {options.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name} - ${opt.price.toFixed(2)} ({opt.isPowerSupply ? `+${opt.watts}W` : `${opt.watts}W`})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selection metadata banner */}
                      {currentSelection && (
                        <div className="mt-4 pt-3.5 border-t border-white/5 flex items-start space-x-3.5 text-xs bg-slate-900/40 p-3 rounded-xl">
                          <img src={currentSelection.image} alt={currentSelection.name} className="w-12 h-12 object-cover rounded-lg border border-white/5 shrink-0 bg-slate-950" />
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-slate-100 truncate">{currentSelection.name}</span>
                              <span className="font-black text-cyan-400 shrink-0">${currentSelection.price.toFixed(2)}</span>
                            </div>
                            <p className="text-slate-500 text-[10px] truncate">{currentSelection.specs}</p>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5">
                              <span>Consumo/Flujo: {currentSelection.isPowerSupply ? `Suministra ${currentSelection.watts}W` : `${currentSelection.watts}W`}</span>
                              <button onClick={() => selectBuilderPart(item.key, null)} className="text-red-400 hover:text-red-300 font-extrabold">Remover</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary panel right col */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel sticky top-28 space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-white/5">
                    <Database className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-extrabold text-white text-base">Consola de Compatibilidad</h3>
                  </div>

                  {/* Components checklist */}
                  <div className="space-y-2.5 text-xs">
                    {Object.entries(builderSpecs).map(([cat, val]) => (
                      <div key={cat} className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 font-semibold">{cat}:</span>
                        {val ? (
                          <span className="text-slate-100 font-bold truncate max-w-[170px]" title={val.name}>{val.name}</span>
                        ) : (
                          <span className="text-slate-700 italic">Pendiente</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Wattage analyzer */}
                  <div className="pt-4 border-t border-white/5 space-y-3.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Consumo Estimado:</span>
                      <span className={isPowerInsufficient ? 'text-red-400' : 'text-emerald-400'}>{builderWatts} W</span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Capacidad de Fuente:</span>
                      <span className="text-white">{psuWatts > 0 ? `${psuWatts} W` : 'Por elegir'}</span>
                    </div>

                    {/* Progress slider bar */}
                    {psuWatts > 0 && (
                      <div className="space-y-1">
                        <div className="w-full bg-[#0B0F19] rounded-full h-2 overflow-hidden border border-white/5">
                          <div 
                            className={`h-full transition-all duration-300 rounded-full ${
                              isPowerInsufficient 
                                ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                : (builderWatts / psuWatts) > 0.8 
                                  ? 'bg-amber-500' 
                                  : 'bg-cyan-500 shadow-neon-cyan'
                            }`}
                            style={{ width: `${Math.min((builderWatts / psuWatts) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-extrabold uppercase">
                          <span>Uso: {((builderWatts / psuWatts) * 100).toFixed(0)}%</span>
                          <span>Max sugerido: 80%</span>
                        </div>
                      </div>
                    )}

                    {/* Watts warning box */}
                    {isPowerInsufficient && (
                      <div className="flex items-start space-x-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl animate-pulse">
                        <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <span>
                          <strong>Cuidado:</strong> El consumo total supera los Watts de tu Fuente de Poder. Tu PC podría apagarse bajo carga. Elige una fuente de poder mayor.
                        </span>
                      </div>
                    )}

                    {psuWatts > 0 && !isPowerInsufficient && (builderWatts / psuWatts) > 0.8 && (
                      <div className="flex items-start space-x-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl">
                        <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <span>
                          <strong>Carga Alta:</strong> Recomendamos una fuente de mayor capacidad para mantener el ventilador en rangos óptimos de eficiencia.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary cost */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wide">Total Rig:</span>
                      <span className="text-2xl font-black text-white glow-cyan">${builderTotal.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => setShowQuoteModal(true)}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
                    >
                      <Receipt className="h-4.5 w-4.5" />
                      <span>Generar Ficha de Cotización</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 3: TRACKING & OPERATIONS BACKOFFICE
            ========================================== */}
        {activeTab === 'rastreo' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center space-y-3.5 pb-4">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Truck className="h-4 w-4 mr-1.5" /> Monitoreo y Logística de Distribución
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">LOGÍSTICA DE HARDWARE</h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
                Introduce el código de guía asignado a tu pedido (`NEX-XXXXXX`) para ver su progreso actual.
              </p>
            </div>

            {/* Input card */}
            <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-grow">
                  <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTrackingInput}
                    onChange={(e) => setSearchTrackingInput(e.target.value)}
                    placeholder="Código de guía NEX-XXXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs uppercase focus:border-cyan-500/40 focus:outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTracking()}
                  />
                </div>
                <button
                  onClick={() => handleSearchTracking()}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Buscar</span>
                </button>
              </div>

              {trackingError && (
                <div className="text-red-400 text-xs bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{trackingError}</span>
                </div>
              )}

              {/* Operating history links */}
              {orders.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Tus Órdenes en Tránsito:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {orders.map(o => (
                      <button
                        key={o.id}
                        onClick={() => {
                          setSearchTrackingInput(o.id);
                          handleSearchTracking(o.id);
                        }}
                        className="px-3.5 py-2 text-xs bg-[#1F293D]/30 border border-white/5 hover:border-purple-500/30 text-slate-400 hover:text-white rounded-xl transition-all font-mono"
                      >
                        <span className="text-cyan-400 font-bold mr-1.5">{o.id}</span>
                        <span className="text-[10px] text-slate-500 font-sans">({o.createdAt.split(' ')[0]})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Results Panel */}
            {trackingResult ? (
              <div className="space-y-6">
                
                {/* Admin Backoffice Console */}
                <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4.5 w-4.5 text-cyan-400" />
                    <span className="text-xs text-white font-extrabold uppercase tracking-wider">
                      PANEL ADMINISTRATIVO DE DESPACHO (CONTROL OPERATIVO INTERNO - FIRESTORE)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Actualiza la bitácora interna de tránsito en Firestore. Todos los clientes suscritos verán los cambios en tiempo real.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { step: 1, label: '1. Recibido' },
                      { step: 2, label: '2. Ensamblado' },
                      { step: 3, label: '3. En Ruta' },
                      { step: 4, label: '4. Entregado' }
                    ].map(btn => (
                      <button
                        key={btn.step}
                        onClick={() => handleSimulateStatusChange(btn.step)}
                        className={`px-3 py-2 text-[10px] font-bold rounded-lg border transition-all ${
                          trackingResult.status === btn.step
                            ? 'bg-cyan-500 text-[#0B0F19] border-transparent font-extrabold shadow-neon-cyan'
                            : 'border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-white bg-slate-955'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracking Detail Card */}
                <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 md:p-8 space-y-8 glass-panel animate-fadeIn">
                  
                  {/* Card Header info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-5 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">ID de Seguimiento</span>
                      <h3 className="font-mono text-lg font-black text-white tracking-wider flex items-center">
                        {trackingResult.id}
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {trackingResult.history.find(h => h.step === trackingResult.status)?.title || 'Procesando'}
                        </span>
                      </h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Destinatario</span>
                      <span className="font-bold text-slate-100 block">{trackingResult.buyerName}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{trackingResult.address}</span>
                    </div>
                  </div>

                  {/* Components items purchased list */}
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/2 space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contenido del Pedido</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      {trackingResult.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-white/2">
                          <span className="truncate pr-4">{item.name} <strong className="text-cyan-500 font-extrabold">x{item.quantity}</strong></span>
                          <span className="font-mono text-[10px] text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-8 md:pl-10 space-y-8 py-3">
                    {/* Background line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-[#1F293D] rounded-full">
                      {/* Active connector */}
                      <div 
                        className="w-full bg-gradient-to-b from-cyan-400 to-purple-500 transition-all duration-700 rounded-full"
                        style={{ height: `${((trackingResult.status - 1) / 3) * 100}%` }}
                      ></div>
                    </div>

                    {trackingResult.history.map(step => {
                      const isCompleted = step.completed;
                      const isActive = step.step === trackingResult.status;

                      return (
                        <div key={step.step} className="relative flex flex-col md:flex-row md:items-start gap-4">
                          
                          {/* Node Icon Circle */}
                          <div className={`absolute -left-[28px] z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive 
                              ? 'bg-[#0B0F19] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110' 
                              : isCompleted 
                                ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 border-transparent text-white' 
                                : 'bg-[#151C2C] border-white/5 text-slate-600'
                          }`}>
                            {step.step === 1 && <Package className="h-4 w-4" />}
                            {step.step === 2 && <Wrench className="h-4 w-4" />}
                            {step.step === 3 && <Truck className="h-4 w-4" />}
                            {step.step === 4 && <CheckCircle2 className="h-4 w-4" />}
                          </div>

                          {/* Node details */}
                          <div className={`flex-grow p-4 rounded-xl border transition-all ${
                            isActive 
                              ? 'border-cyan-500/35 bg-cyan-500/5 text-slate-200 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                              : isCompleted 
                                ? 'border-white/5 bg-[#151C2C]/30 text-slate-300' 
                                : 'border-white/2 bg-[#151C2C]/5 text-slate-600'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-1.5 mb-1.5 text-xs">
                              <h4 className={`font-bold ${isActive ? 'text-white text-sm font-extrabold' : isCompleted ? 'text-slate-100' : 'text-slate-600'}`}>
                                {step.title}
                              </h4>
                              {isCompleted && (
                                <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
                                  <Clock className="h-3 w-3 text-cyan-500" />
                                  <span>{step.time}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-xs text-slate-400">
                              {step.desc}
                            </p>

                            {isCompleted && step.location !== '--' && (
                              <div className="flex items-center space-x-1 text-[9px] text-cyan-400 font-extrabold uppercase mt-2.5">
                                <MapPin className="h-3 w-3" />
                                <span>Lugar: {step.location}</span>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl glass-panel">
                <Truck className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-xs">Introduce el código de guía para monitorear tu pedido real en la nube.</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 4: FACTURACIÓN FISCAL (CFDI PORTAL)
            ========================================== */}
        {activeTab === 'facturacion' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Title header */}
            <div className="text-center space-y-3.5 pb-4">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileCheck className="h-4 w-4 mr-1.5" /> Portal de Autofacturación Fiscal
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">FACTURACIÓN ELECTRÓNICA</h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
                Obtén tu CFDI de compra y descarga la representación impresa oficial en formato PDF.
              </p>
            </div>

            {/* Generated invoice CFDI layout */}
            {generatedInvoice ? (
              <div className="space-y-6">
                
                {/* Print and Return Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#151C2C]/30 p-4 border border-white/5 rounded-2xl">
                  <span className="text-xs text-slate-400">Su comprobante CFDI ha sido generado y timbrado con éxito.</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setGeneratedInvoice(null)}
                      className="px-4 py-2 text-xs font-bold bg-[#1e293b] text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all"
                    >
                      Facturar otro pedido
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl shadow-neon-cyan transition-all flex items-center space-x-1.5"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Imprimir Factura (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Printable Invoice Page Layout */}
                <div id="sat-invoice" className="bg-white text-slate-900 p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-300 space-y-6 text-[10px] font-sans">
                  
                  {/* Sat Top Banner */}
                  <div className="flex justify-between items-start border-b border-slate-300 pb-5 gap-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight text-slate-900">FACTURA ELECTRÓNICA CFDI</h2>
                      <p className="font-bold text-slate-600">VERSIÓN 4.0</p>
                    </div>
                    <div className="text-right font-mono space-y-0.5">
                      <p className="text-slate-500 font-sans font-semibold">FOLIO FISCAL (UUID)</p>
                      <p className="font-bold text-slate-900 text-xs">{generatedInvoice.uuid}</p>
                      <p className="text-slate-500 font-sans font-semibold">NÚMERO DE CERTIFICADO SAT</p>
                      <p className="font-bold text-slate-900">00001000000504465028</p>
                      <p className="text-slate-500 font-sans font-semibold font-bold">FECHA Y HORA DE CERTIFICACIÓN</p>
                      <p className="font-bold text-slate-900">{generatedInvoice.certTime}</p>
                    </div>
                  </div>

                  {/* Emisor / Receptor details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200 pb-5">
                    <div className="space-y-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 mb-1.5 uppercase">EMISOR</h4>
                      <p><strong className="text-slate-500">Razón Social:</strong> <span className="font-bold">{generatedInvoice.razonSocialEmisor}</span></p>
                      <p><strong className="text-slate-500">RFC:</strong> <span className="font-mono font-bold">{generatedInvoice.rfcEmisor}</span></p>
                      <p><strong className="text-slate-500">Régimen Fiscal:</strong> <span>{generatedInvoice.regimenEmisor}</span></p>
                    </div>
                    <div className="space-y-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 mb-1.5 uppercase">RECEPTOR</h4>
                      <p><strong className="text-slate-500">Razón Social:</strong> <span className="font-bold">{generatedInvoice.razonSocialReceptor}</span></p>
                      <p><strong className="text-slate-500">RFC:</strong> <span className="font-mono font-bold">{generatedInvoice.rfcReceptor}</span></p>
                      <p><strong className="text-slate-500">Domicilio Fiscal (CP):</strong> <span>{generatedInvoice.cpReceptor}</span></p>
                      <p><strong className="text-slate-500">Régimen Receptor:</strong> <span>{generatedInvoice.regimenReceptor}</span></p>
                      <p><strong className="text-slate-500">Uso de CFDI:</strong> <span className="uppercase">{generatedInvoice.usoCfdi}</span></p>
                    </div>
                  </div>

                  {/* Concepts Table */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 uppercase">Conceptos del Pedido</h4>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-500 font-bold">
                          <th className="py-2">Clave</th>
                          <th className="py-2">Cant.</th>
                          <th className="py-2">Descripción</th>
                          <th className="py-2 text-right">P. Unitario</th>
                          <th className="py-2 text-right">Importe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedInvoice.order.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 text-slate-800">
                            <td className="py-2 font-mono">43201500</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">{item.name} ({item.category})</td>
                            <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                            <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations */}
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2 border-t border-slate-300 pt-3 text-right">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono font-bold text-slate-900">${generatedInvoice.order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>IVA Trasladado (16.00%):</span>
                        <span className="font-mono font-bold text-slate-900">${generatedInvoice.order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-slate-900">
                        <span>TOTAL FACTURA:</span>
                        <span className="font-mono">${generatedInvoice.order.total.toFixed(2)} MXN</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital stamps SAT layout */}
                  <div className="border-t border-slate-300 pt-5 flex flex-col md:flex-row items-center md:items-start gap-6 font-mono text-[8px] text-slate-500 leading-normal">
                    
                    {/* CSS dynamic QR code */}
                    <div className="w-24 h-24 bg-white border border-slate-300 p-1 shrink-0 grid grid-cols-12 gap-0.5 select-none">
                      {qrPattern.map((cellBlack, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 ${cellBlack ? 'bg-black' : 'bg-white'}`}></div>
                      ))}
                    </div>

                    {/* Cert seals */}
                    <div className="flex-grow space-y-3.5 max-w-full overflow-hidden">
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 font-bold block">CADENA ORIGINAL DE CERTIFICACIÓN DIGITAL DEL SAT</strong>
                        <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                          {generatedInvoice.cadenaOriginal}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 font-bold block">SELLO DIGITAL DEL EMISOR</strong>
                        <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                          {generatedInvoice.selloEmisor}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 font-bold block">SELLO DIGITAL DEL SAT</strong>
                        <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                          {generatedInvoice.selloSAT}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ) : (
              /* Request Invoicing form */
              <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel space-y-6">
                
                {/* Search Order bar */}
                <div className="space-y-3">
                  <label className="text-xs text-slate-300 font-extrabold uppercase tracking-wide">Paso 1: Localizar Pedido</label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="relative flex-grow">
                      <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={invoiceSearchCode}
                        onChange={(e) => setInvoiceSearchCode(e.target.value)}
                        placeholder="Ingrese código de pedido (NEX-XXXXXX)"
                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs uppercase focus:border-cyan-500/40 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleSearchOrderToBill()}
                      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
                    >
                      <Search className="h-4 w-4" />
                      <span>Buscar Pedido</span>
                    </button>
                  </div>
                  {invoiceSearchError && (
                    <span className="text-red-400 text-xs flex items-center space-x-1.5 pt-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{invoiceSearchError}</span>
                    </span>
                  )}
                </div>

                {/* Tax inputs form */}
                {selectedOrderToBill && (
                  <div className="pt-6 border-t border-white/5 space-y-5 animate-fadeIn">
                    
                    {/* Selected order abstract */}
                    <div className="p-4 bg-slate-900 border border-white/2 rounded-xl text-xs text-slate-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Orden Encontrada</span>
                        <span className="font-mono text-white font-bold">{selectedOrderToBill.id}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Importe Total (IVA Inc.)</span>
                        <span className="font-mono text-cyan-400 font-bold">${selectedOrderToBill.total.toFixed(2)} MXN</span>
                      </div>
                    </div>

                    <form onSubmit={handleGenerateCFDI} className="space-y-4 text-xs">
                      <span className="text-xs text-slate-300 font-extrabold uppercase tracking-wide block">Paso 2: Registrar Datos de Facturación</span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">RFC (Receptor)</label>
                          <input 
                            required 
                            type="text" 
                            maxLength={13}
                            placeholder="RFC (12 o 13 caracteres)"
                            value={billingForm.rfc}
                            onChange={(e) => setBillingForm({ ...billingForm, rfc: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl uppercase focus:border-cyan-500/40 focus:outline-none" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Razón Social (Receptor)</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Nombre completo o razón social registrada en SAT"
                            value={billingForm.razonSocial}
                            onChange={(e) => setBillingForm({ ...billingForm, razonSocial: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Código Postal Fiscal</label>
                          <input 
                            required 
                            type="text" 
                            maxLength={5}
                            placeholder="Código Postal receptor"
                            value={billingForm.cp}
                            onChange={(e) => setBillingForm({ ...billingForm, cp: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Régimen Fiscal (SAT)</label>
                          <select 
                            value={billingForm.regimen}
                            onChange={(e) => setBillingForm({ ...billingForm, regimen: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                          >
                            <option value="601">601 - General de Ley Personas Morales</option>
                            <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                            <option value="605">605 - Sueldos y Salarios</option>
                            <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                            <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Uso de CFDI</label>
                        <select 
                          value={billingForm.usoCfdi}
                          onChange={(e) => setBillingForm({ ...billingForm, usoCfdi: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                        >
                          <option value="G01">G01 - Adquisición de mercancías</option>
                          <option value="G03">G03 - Gastos en general</option>
                          <option value="I01">I01 - Construcciones</option>
                          <option value="I02">I02 - Mobiliario y equipo de oficina por inversiones</option>
                          <option value="I04">I04 - Equipo de cómputo y accesorios</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-1.5"
                      >
                        <FileCheck className="h-4.5 w-4.5" />
                        <span>Generar y Timbrar CFDI 4.0</span>
                      </button>

                    </form>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 5: ORDERS HISTORY LIST FOR CURRENT USER
            ========================================== */}
        {activeTab === 'orders-list' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="border-b border-white/5 pb-4">
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
                <History className="h-7 w-7 text-cyan-400" />
                <span>MIS COMPRAS</span>
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Historial completo de facturación, comprobantes y logística vinculada a tu cuenta.
              </p>
            </div>

            {orders.filter(o => o.buyerName === currentUser?.name).length > 0 ? (
              <div className="space-y-4">
                {orders
                  .filter(o => o.buyerName === currentUser?.name)
                  .map(order => (
                    <div key={order.id} className="p-5 rounded-2xl border border-white/5 bg-[#151C2C]/40 glass-panel space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Código de Pedido</span>
                          <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Fecha / Hora de Compra</span>
                          <span className="text-slate-300 font-mono font-semibold">{order.createdAt}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSearchTrackingInput(order.id);
                              handleSearchTracking(order.id);
                              setActiveTab('rastreo');
                            }}
                            className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                          >
                            Rastrear Envío
                          </button>
                          <button
                            onClick={() => {
                              setInvoiceSearchCode(order.id);
                              handleSearchOrderToBill(order.id);
                              setActiveTab('facturacion');
                            }}
                            className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-purple-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                          >
                            Facturar Compra
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Componentes Adquiridos:</span>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                              <span>{item.name} <strong className="text-cyan-400/80">x{item.quantity}</strong></span>
                              <span className="font-mono text-[10px]">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-baseline text-xs">
                        <span className="text-slate-500 font-bold uppercase">Total Pagado:</span>
                        <span className="font-black text-white text-sm">${order.total.toFixed(2)} (IVA Inc.)</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl glass-panel">
                <ShoppingBag className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-xs">No has realizado ninguna compra con esta cuenta.</p>
                <button
                  onClick={() => setActiveTab('catalogo')}
                  className="mt-4 text-xs text-cyan-400 hover:underline font-bold"
                >
                  Explorar Componentes
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ==========================================
          SHOPPING CART DRAWER (RIGHT PANEL)
          ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-md h-full bg-[#151C2C] border-l border-white/5 shadow-2xl flex flex-col justify-between z-10 animate-slideLeft">
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="h-5 w-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-lg">Carrito de Compras</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-white/5 shrink-0 bg-slate-950" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                      
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="font-black text-cyan-400 text-xs">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        {/* Stepper */}
                        <div className="flex items-center space-x-1.5 bg-slate-950/80 rounded-md p-1 border border-white/5">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="p-0.5 text-slate-400 hover:text-white rounded"><Minus className="h-3 w-3" /></button>
                          <span className="text-white text-xs font-bold px-1 text-center min-w-[14px]">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="p-0.5 text-slate-400 hover:text-white rounded"><Plus className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <ShoppingBag className="h-14 w-14 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 text-xs">El carrito está vacío.</p>
                  <button onClick={() => { setIsCartOpen(false); setActiveTab('catalogo'); }} className="mt-4 text-xs text-cyan-400 font-bold hover:underline">Explorar Catálogo</button>
                </div>
              )}
            </div>

            {/* Bottom summary and check actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-slate-900/60 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">${getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IVA (16%)</span>
                    <span className="text-white font-semibold">${(getCartSubtotal() * 0.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Envío Express</span>
                    <span className="text-emerald-400 font-bold uppercase">Gratuito</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-white/5 text-sm">
                    <span className="font-extrabold text-white">Total</span>
                    <span className="text-xl font-extrabold text-white glow-cyan">
                      ${(getCartSubtotal() * 1.16).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
                >
                  <span>Proceder al Pago</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL A: LOGIN & REGISTER PANEL (CYBERPUNK STYLE)
          ========================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151C2C] p-6 md:p-8 shadow-2xl z-10 animate-zoomIn">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1 mb-6">
              <div className="inline-flex bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20 mb-1.5">
                <User className="h-5.5 w-5.5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-black text-white tracking-widest uppercase">
                {authMode === 'login' ? 'INGRESO A LA RED' : 'REGISTRO DE USUARIO'}
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Nexus Rig Builders Club</p>
            </div>

            {authError && (
              <div className="text-red-400 text-xs bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Ej: Sofia Martinez" 
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        required 
                        type="email" 
                        placeholder="sofia@gmail.com" 
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Correo Electrónico / Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    required 
                    type="text" 
                    placeholder="cyber_gamer@nexus.com" 
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" 
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-1.5 mt-2"
              >
                {authMode === 'login' ? <User className="h-4.5 w-4.5" /> : <UserPlus className="h-4.5 w-4.5" />}
                <span>{authMode === 'login' ? 'Conectar' : 'Registrar Cuenta'}</span>
              </button>

              <div className="relative flex py-2 items-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4">O CONECTAR CON</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-[#1E293B]/60 hover:bg-[#1E293B]/80 text-white rounded-xl font-bold transition-all border border-white/5 hover:border-white/10 flex items-center justify-center space-x-2"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <div className="text-center pt-2 text-[10px]">
                {authMode === 'login' ? (
                  <p className="text-slate-500">
                    ¿No tienes una cuenta?{' '}
                    <button type="button" onClick={() => setAuthMode('register')} className="text-cyan-400 hover:underline font-bold">
                      Crea una aquí
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500">
                    ¿Ya tienes una cuenta?{' '}
                    <button type="button" onClick={() => setAuthMode('login')} className="text-cyan-400 hover:underline font-bold">
                      Inicia sesión
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL B: SECURE CHECKOUT GATEWAY
          ========================================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCheckoutModal(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#151C2C] p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-zoomIn">
            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>

            <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-6">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-lg">Pasarela de Pago Segura</h3>
            </div>

            <form 
              onSubmit={(e) => {
                const addressVal = e.target.elements.address.value;
                handleCheckoutSuccess(e, { address: addressVal });
              }} 
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Cliente</label>
                  <input readOnly type="text" value={currentUser?.name || ''} className="w-full px-3 py-2 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 cursor-not-allowed outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Email de Confirmación</label>
                  <input readOnly type="email" value={currentUser?.email || ''} className="w-full px-3 py-2 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 cursor-not-allowed outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Dirección de Despacho</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input required name="address" type="text" placeholder="Calle Gamer #777, Zona de Ensambles, Monterrey" className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                </div>
              </div>

              {/* Payment specifications */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/2 space-y-3.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Información Bancaria de Pago</span>
                
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Tarjeta de Crédito / Débito</label>
                  <input required type="text" placeholder="4152 7728 9912 3456" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Expiración</label>
                    <input required type="text" placeholder="12/30" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">CVC / CVV</label>
                    <input required type="password" placeholder="***" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total a Debitar:</span>
                  <span className="font-black text-white text-lg glow-cyan">${(getCartSubtotal() * 1.16).toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan"
                >
                  Completar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL C: ORDER CONFIRMATION & TRACKING CODE
          ========================================== */}
      {newOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setNewOrderSuccess(null)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/25 bg-[#151C2C] p-6 shadow-2xl z-10 text-center space-y-5 animate-zoomIn">
            <div className="inline-flex bg-emerald-500/10 p-3 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">¡PAGO PROCESADO EXITOSAMENTE!</h3>
              <p className="text-slate-400 text-xs">
                Se ha generado tu orden de compra en el sistema técnico de ensamblaje. Tu número de guía ha sido asignado.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1 font-mono">
              <span className="text-[9px] text-slate-500 font-sans uppercase tracking-widest block font-bold">Código de Rastreo</span>
              <span className="text-lg font-black text-cyan-400 tracking-widest">{newOrderSuccess.id}</span>
              <span className="text-[9px] text-slate-400 block font-sans mt-1.5">{newOrderSuccess.createdAt}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setNewOrderSuccess(null)}
                className="flex-grow py-3 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSearchTrackingInput(newOrderSuccess.id);
                  handleSearchTracking(newOrderSuccess.id);
                  setActiveTab('rastreo');
                  setNewOrderSuccess(null);
                }}
                className="flex-grow py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold transition-all text-xs shadow-neon-cyan"
              >
                Ir a Rastrear Orden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL D: PRINTABLE PC BUILDER INVOICE
          ========================================== */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowQuoteModal(false)} className="absolute inset-0 bg-[#0B0F19]/85 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#151C2C] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-zoomIn">
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>

            {/* Quote details */}
            <div className="space-y-6 pt-2">
              <div className="text-center pb-4 border-b border-dashed border-white/10 space-y-1">
                <div className="inline-flex bg-cyan-500/10 p-2.5 rounded-lg mb-1.5">
                  <Receipt className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-mono text-base font-black text-white tracking-widest">COTIZACIÓN FORMAL DE HARDWARE</h3>
                <p className="text-[9px] text-slate-500 font-mono">
                  COTIZACIÓN NRO-#{Math.floor(100000 + Math.random() * 900000)} | FECHA: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Items listing */}
              <div className="space-y-4">
                <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block">Componentes Configurados</span>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(builderSpecs).map(([cat, val]) => {
                    if (!val) return null;
                    return (
                      <div key={cat} className="flex justify-between items-center py-2 px-3.5 bg-[#0B0F19] rounded-xl text-xs border border-white/2">
                        <div>
                          <span className="text-[9px] font-extrabold text-cyan-400 uppercase block tracking-wide">{cat}</span>
                          <span className="text-white font-bold">{val.name}</span>
                        </div>
                        <span className="font-black text-slate-300 ml-4">${val.price.toFixed(2)}</span>
                      </div>
                    );
                  })}

                  {activeSelectedParts.length === 0 && (
                    <div className="text-center py-8 text-xs italic text-slate-600">
                      No has seleccionado ningún componente todavía.
                    </div>
                  )}
                </div>
              </div>

              {/* Specs parameters */}
              <div className="bg-[#0B0F19] p-4 rounded-xl border border-white/5 space-y-3.5 font-mono text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Piezas Totales:</span>
                  <span className="text-white font-bold">{activeSelectedParts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Carga de Energía:</span>
                  <span className="text-white font-bold">{builderWatts} W</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-white/10 pt-3.5 text-sm">
                  <span className="text-white font-bold">TOTAL COTIZADO:</span>
                  <span className="text-cyan-400 font-black">${builderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-grow py-3 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-xs"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-grow py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2 text-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Imprimir Cotización</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="w-full glass-panel border-t border-white/5 py-6 px-4 md:px-8 text-center text-[11px] text-slate-500 mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 uppercase font-bold tracking-wider">
          <div>
            <p>© 2026 Nexus Hardware S.A. Portal de Ensamblaje y Logística de Hardware.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-cyan-400 cursor-pointer">Soporte Técnico</span>
            <span>•</span>
            <span className="hover:text-cyan-400 cursor-pointer">Garantía Neón</span>
            <span>•</span>
            <span className="hover:text-cyan-400 cursor-pointer">Nodos de Reparto</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
