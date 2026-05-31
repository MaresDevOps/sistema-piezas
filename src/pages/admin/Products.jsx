import React, { useState } from 'react';
import { Package, PlusCircle, Edit3, Tag, Filter, CreditCard, Database, Zap, Image, FileText, XCircle, Save, Trash2, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminProducts() {
  const { products, setProducts } = useProducts();
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState({ type: '', text: '' });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [adminProductForm, setAdminProductForm] = useState({
    name: '', category: 'CPU', price: '', stock: '', watts: '', image: '', specs: '', isPowerSupply: false
  });
  const [productToDelete, setProductToDelete] = useState(null);

  const handleAdminAddProduct = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMsg({ type: '', text: '' });
    try {
      const newId = Date.now();
      const prod = {
        id: newId,
        name: adminProductForm.name.trim(),
        category: adminProductForm.category,
        price: parseFloat(adminProductForm.price),
        stock: parseInt(adminProductForm.stock),
        watts: parseInt(adminProductForm.watts) || 0,
        image: adminProductForm.image.trim() || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
        specs: adminProductForm.specs.trim(),
        isPowerSupply: adminProductForm.category === 'PSU'
      };
      await setDoc(doc(db, 'products', newId.toString()), prod);
      setProducts(prev => [...prev, prod].sort((a, b) => a.id - b.id));
      setAdminProductForm({ name: '', category: 'CPU', price: '', stock: '', watts: '', image: '', specs: '', isPowerSupply: false });
      setShowProductForm(false);
      setAdminMsg({ type: 'success', text: `✅ Producto "${prod.name}" agregado correctamente.` });
    } catch (err) {
      setAdminMsg({ type: 'error', text: '❌ Error al agregar el producto: ' + err.message });
    }
    setAdminLoading(false);
  };

  const handleAdminEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setAdminLoading(true);
    setAdminMsg({ type: '', text: '' });
    try {
      const updated = {
        ...editingProduct,
        name: adminProductForm.name.trim(),
        category: adminProductForm.category,
        price: parseFloat(adminProductForm.price),
        stock: parseInt(adminProductForm.stock),
        watts: parseInt(adminProductForm.watts) || 0,
        image: adminProductForm.image.trim() || editingProduct.image,
        specs: adminProductForm.specs.trim(),
        isPowerSupply: adminProductForm.category === 'PSU'
      };
      await updateDoc(doc(db, 'products', editingProduct.id.toString()), updated);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      setEditingProduct(null);
      setShowProductForm(false);
      setAdminProductForm({ name: '', category: 'CPU', price: '', stock: '', watts: '', image: '', specs: '', isPowerSupply: false });
      setAdminMsg({ type: 'success', text: `✅ Producto "${updated.name}" actualizado correctamente.` });
    } catch (err) {
      setAdminMsg({ type: 'error', text: '❌ Error al actualizar: ' + err.message });
    }
    setAdminLoading(false);
  };

  const handleAdminDeleteProduct = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setAdminMsg({ type: '', text: '' });
    try {
      await deleteDoc(doc(db, 'products', productToDelete.id.toString()));
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setAdminMsg({ type: 'success', text: `🗑️ Producto "${productToDelete.name}" eliminado.` });
    } catch (err) {
      setAdminMsg({ type: 'error', text: '❌ Error al eliminar: ' + err.message });
    }
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6">
      {adminMsg.text && (
        <div className={`flex items-center space-x-2 p-3.5 rounded-xl border text-xs font-semibold ${
          adminMsg.type === 'success'
            ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400'
            : 'bg-red-950/30 border-red-500/20 text-red-400'
        }`}>
          {adminMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
          <span>{adminMsg.text}</span>
          <button onClick={() => setAdminMsg({ type: '', text: '' })} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setProductToDelete(null)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/30 bg-[#151C2C] p-6 shadow-2xl z-10 animate-zoomIn text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Eliminar Producto</h3>
            <p className="text-sm text-slate-400 mb-6">
              ¿Estás seguro de que deseas eliminar <strong className="text-white">"{productToDelete.name}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-neon-danger text-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white flex items-center space-x-2"><Package className="h-5 w-5 text-purple-400" /><span>Gestión de Productos</span></h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setAdminProductForm({ name: '', category: 'CPU', price: '', stock: '', watts: '', image: '', specs: '', isPowerSupply: false });
            setShowProductForm(v => !v);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {showProductForm && (
        <div className="rounded-2xl border border-purple-500/20 bg-[#151C2C] p-6 space-y-5 animate-zoomIn">
          <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
            {editingProduct ? <Edit3 className="h-4 w-4 text-yellow-400" /> : <PlusCircle className="h-4 w-4 text-purple-400" />}
            <span>{editingProduct ? `Editar: ${editingProduct.name}` : 'Nuevo Producto'}</span>
          </h3>
          <form onSubmit={editingProduct ? handleAdminEditProduct : handleAdminAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><Tag className="h-3.5 w-3.5" /><span>Nombre del producto *</span></label>
              <input
                required type="text" placeholder="Ej: AMD Ryzen 9 7950X3D"
                value={adminProductForm.name}
                onChange={e => setAdminProductForm({ ...adminProductForm, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              />
            </div>
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><Filter className="h-3.5 w-3.5" /><span>Categoría *</span></label>
              <select
                required
                value={adminProductForm.category}
                onChange={e => setAdminProductForm({ ...adminProductForm, category: e.target.value, isPowerSupply: e.target.value === 'PSU' })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              >
                {['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Case'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><CreditCard className="h-3.5 w-3.5" /><span>Precio (USD) *</span></label>
              <input
                required type="number" min="0" step="0.01" placeholder="0.00"
                value={adminProductForm.price}
                onChange={e => setAdminProductForm({ ...adminProductForm, price: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              />
            </div>
            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><Database className="h-3.5 w-3.5" /><span>Stock (unidades) *</span></label>
              <input
                required type="number" min="0" placeholder="0"
                value={adminProductForm.stock}
                onChange={e => setAdminProductForm({ ...adminProductForm, stock: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              />
            </div>
            {/* Watts */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><Zap className="h-3.5 w-3.5" /><span>Watts / TDP</span></label>
              <input
                type="number" min="0" placeholder="0"
                value={adminProductForm.watts}
                onChange={e => setAdminProductForm({ ...adminProductForm, watts: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              />
            </div>
            {/* Image URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><Image className="h-3.5 w-3.5" /><span>URL de Imagen</span></label>
              <input
                type="url" placeholder="https://images.unsplash.com/..."
                value={adminProductForm.image}
                onChange={e => setAdminProductForm({ ...adminProductForm, image: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none"
              />
              {adminProductForm.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/5 w-20 h-20">
                  <img src={adminProductForm.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>
            {/* Specs */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-400 font-semibold flex items-center space-x-1.5"><FileText className="h-3.5 w-3.5" /><span>Especificaciones *</span></label>
              <textarea
                required rows={2} placeholder="Ej: Gama Alta: 16 Cores / 32 Threads, 5.7GHz Boost..."
                value={adminProductForm.specs}
                onChange={e => setAdminProductForm({ ...adminProductForm, specs: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-purple-500/40 focus:outline-none resize-none"
              />
            </div>
            {/* Action buttons */}
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                className="flex-1 py-3 bg-[#0B0F19] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
              >
                <XCircle className="h-4 w-4" /><span>Cancelar</span>
              </button>
              <button
                type="submit"
                disabled={adminLoading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                <span>{adminLoading ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-2xl border border-white/5 bg-[#151C2C]/40 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{products.length} productos en catálogo</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0B0F19]/60">
              <tr>
                {['Imagen', 'Nombre', 'Cat.', 'Precio', 'Stock', 'Watts', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-white/5 bg-slate-950" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-white truncate max-w-[180px]">{product.name}</p>
                    <p className="text-slate-600 text-[10px] truncate max-w-[180px]">{product.specs?.slice(0, 50)}…</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-white">${product.price?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${product.stock <= 5 ? 'text-red-400' : product.stock <= 15 ? 'text-yellow-400' : 'text-emerald-400'}`}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{product.watts}W</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setAdminProductForm({
                            name: product.name,
                            category: product.category,
                            price: product.price?.toString(),
                            stock: product.stock?.toString(),
                            watts: product.watts?.toString(),
                            image: product.image,
                            specs: product.specs,
                            isPowerSupply: product.isPowerSupply || false
                          });
                          setShowProductForm(true);
                          setAdminMsg({ type: '', text: '' });
                        }}
                        className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 transition-all"
                        title="Editar"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdminDeleteProduct(product)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 text-slate-600 text-xs">No hay productos todavía.</div>
          )}
        </div>
      </div>
    </div>
  );
}
