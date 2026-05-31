import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Check, Plus, AlertTriangle, ShieldCheck, Truck, Zap } from 'lucide-react';
import ProductReviews from '../components/reviews/ProductReviews';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts } = useProducts();
  const { addToCart, justAddedProduct, setIsCartOpen, setShowCheckoutModal } = useCart();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    if (!loadingProducts && products.length > 0) {
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setActiveImage(found.gallery?.[0] || found.image);
        
        // Find related products
        const related = products
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
    }
  }, [id, products, loadingProducts]);

  if (loadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Cargando producto...</span>
      </div>
    );
  }

  if (!product && !loadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fadeIn">
        <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white">Producto No Encontrado</h2>
        <p className="text-slate-400">El producto que buscas no existe o ha sido retirado de nuestro catálogo.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-bold transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const isJustAdded = justAddedProduct === product?.id;

  const handleBuyNow = () => {
    addToCart(product);
    setShowCheckoutModal(true);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto space-y-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-wider">Volver al catálogo</span>
      </button>

      {/* Main Container */}
      <div className="bg-[#151C2C]/80 border border-white/5 rounded-3xl overflow-hidden glass-panel flex flex-col md:flex-row">
        
        {/* Left Col: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col space-y-4 bg-slate-950/50 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 z-0 pointer-events-none"></div>
          
          {/* Main Image */}
          <div className="relative z-10 w-full aspect-square md:aspect-auto md:h-96 min-h-[300px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <img 
              src={activeImage} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="relative z-10 flex space-x-3 overflow-x-auto pb-2 justify-center scrollbar-thin">
              {product.gallery.map((imgUrl, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === imgUrl ? 'border-cyan-400 opacity-100 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col space-y-8">
          
          {/* Header info */}
          <div className="space-y-3">
            <span className="inline-flex text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-md">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Stock */}
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <span className="text-4xl md:text-5xl font-black text-white glow-cyan tracking-tighter">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 font-bold mb-1.5 uppercase">MXN</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                product.stock > 5 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                product.stock > 0 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 
                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
              }`}></span>
              <span className="text-sm font-bold text-slate-300">
                {product.stock > 0 ? `Stock Disponible: ${product.stock} unidades` : 'Agotado Temporalmente'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comprar Ahora
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all border flex items-center justify-center space-x-2 ${
                isJustAdded 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-neon-emerald'
                  : 'bg-[#0B0F19]/50 hover:bg-[#1e293b] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {isJustAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              <span>{isJustAdded ? 'Agregado al Carrito' : 'Agregar al Carrito'}</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-3 text-slate-400">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Garantía Neón</span>
                <span className="text-[10px]">1 año con Nexus Hardware</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Truck className="h-6 w-6 text-cyan-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Envío Express</span>
                <span className="text-[10px]">A todo México gratuito</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications Block */}
      <div className="bg-[#151C2C]/50 border border-white/5 rounded-3xl p-6 md:p-10 glass-panel space-y-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-white tracking-tight">Especificaciones Técnicas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Descripción General</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {product.specs}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Ficha Técnica</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center bg-[#0B0F19] p-3 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400 font-bold">Categoría</span>
                <span className="text-sm text-white font-black">{product.category}</span>
              </li>
              <li className="flex justify-between items-center bg-[#0B0F19] p-3 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400 font-bold">
                  {product.isPowerSupply ? 'Potencia de Suministro' : 'Consumo Energético (TDP)'}
                </span>
                <span className="text-sm text-cyan-400 font-black">{product.watts} Watts</span>
              </li>
              <li className="flex justify-between items-center bg-[#0B0F19] p-3 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400 font-bold">ID del Producto</span>
                <span className="text-sm text-slate-500 font-mono">{product.id}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 space-y-6 animate-fadeIn delay-300">
          <h2 className="text-xl font-black text-white tracking-tight border-b border-white/5 pb-3">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <div 
                key={rel.id} 
                onClick={() => {
                  window.scrollTo(0,0);
                  navigate(`/producto/${rel.id}`);
                }}
                className="group cursor-pointer bg-[#151C2C]/50 border border-white/5 rounded-2xl overflow-hidden glass-panel hover:border-cyan-500/30 transition-all hover:-translate-y-1"
              >
                <div className="h-32 overflow-hidden bg-slate-950 relative">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2 bg-[#0B0F19]/80 text-cyan-400 text-[8px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {rel.category}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">{rel.name}</h4>
                  <div className="font-black text-cyan-400 text-sm">${rel.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
