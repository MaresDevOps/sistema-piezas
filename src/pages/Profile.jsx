import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Mail, Award, Shield, Save, Edit2, X } from 'lucide-react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    rank: '',
    role: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Subscribe to real-time updates for the current user
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          phone: data.phone || '',
          rank: data.rank || 'Rig Builder Rookie',
          role: data.role || 'user',
          avatarUrl: data.avatarUrl || ''
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: profileData.name,
        address: profileData.address,
        phone: profileData.phone,
        avatarUrl: profileData.avatarUrl
      });
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente.');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Error al actualizar el perfil.');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-slate-400 font-bold uppercase">Inicia sesión para ver tu perfil</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
        <User className="h-8 w-8 text-cyan-400" />
        <h1 className="text-3xl font-black text-white tracking-tight">Centro de Mando Personal</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Avatar and Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#151C2C]/80 border border-white/5 p-6 rounded-3xl glass-panel flex flex-col items-center text-center space-y-4">
            
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-1 shadow-2xl">
                <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center border-4 border-[#151C2C] overflow-hidden">
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-white uppercase">{profileData.name.charAt(0) || '?'}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
              <div className="flex items-center justify-center space-x-1.5 text-cyan-400">
                <Award className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{profileData.rank}</span>
              </div>
            </div>

            {profileData.role === 'admin' && (
              <div className="mt-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-black px-3 py-1 rounded-full flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Administrador del Sistema</span>
              </div>
            )}
          </div>
          
          <div className="bg-[#151C2C]/50 border border-white/5 p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Estadísticas</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between text-slate-300">
                <span>Miembro desde:</span>
                <span className="font-bold text-white">Mayo 2026</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>Ensambles Guardados:</span>
                <span className="font-bold text-white">0</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>Nivel de Confianza:</span>
                <span className="font-bold text-emerald-400">Verificado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Editable Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#151C2C]/80 border border-white/5 p-6 md:p-8 rounded-3xl glass-panel relative">
            
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>Datos de Contacto y Envío</span>
              </h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 bg-cyan-500/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
                <span>{isEditing ? 'Cancelar Edición' : 'Editar Datos'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre de Identificación</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      required 
                      disabled={!isEditing}
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-cyan-500/40 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico (No editable)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      disabled
                      type="email" 
                      value={profileData.email}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/40 border border-white/5 rounded-xl text-slate-400 cursor-not-allowed outline-none text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dirección de Despacho (Predeterminada)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <textarea 
                      disabled={!isEditing}
                      rows="2"
                      placeholder="Agrega tu dirección principal para autocompletar tus compras"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-cyan-500/40 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed resize-none text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avatar URL</label>
                  <input 
                    disabled={!isEditing}
                    type="url" 
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={profileData.avatarUrl}
                    onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0B0F19] border border-white/5 rounded-xl text-white focus:border-cyan-500/40 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm" 
                  />
                </div>

              </div>

              {isEditing && (
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center space-x-2 text-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
