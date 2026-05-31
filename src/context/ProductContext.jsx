import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { SEED_PRODUCTS } from '../data/seedProducts';

export const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      if (true) { // Force re-seed
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
      setProducts(SEED_PRODUCTS);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      loadingProducts,
      fetchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};
