import React, { useEffect, useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/admin/products');
      return;
    }
    
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id });
      });
      setAllUsers(list);
    });
    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleAdminUpdateUserRole = async (userId, newRole) => {
    if (currentUser?.role !== 'admin') return;
    try {
      let newRank = 'Rig Builder Rookie';
      let newColor = 'from-purple-500 to-pink-500';
      
      if (newRole === 'admin') {
        newRank = 'Administrator';
        newColor = 'from-purple-600 to-indigo-600';
      } else if (newRole === 'encargado') {
        newRank = 'Encargado de Catálogo';
        newColor = 'from-cyan-500 to-blue-500';
      }

      await updateDoc(doc(db, 'users', userId), { 
        role: newRole,
        rank: newRank,
        avatarColor: newColor
      });
      toast.success('Rol de usuario actualizado con éxito.');
    } catch (err) {
      toast.error('Error al actualizar rol de usuario: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-white flex items-center space-x-2"><UsersIcon className="h-5 w-5 text-purple-400" /><span>Gestión de Usuarios ({allUsers.length})</span></h2>
      
      <div className="rounded-2xl border border-white/5 bg-[#151C2C]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0B0F19]/60">
              <tr>
                {['Usuario', 'Email', 'Rol', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {allUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.avatarColor || 'from-slate-700 to-slate-800'} flex items-center justify-center text-[10px] text-white font-extrabold uppercase shrink-0`}>
                        {user.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-white truncate max-w-[150px]">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : user.role === 'encargado' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {user.role === 'admin' ? 'Superadmin' : user.role === 'encargado' ? 'Encargado' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <select 
                        value={user.role || 'user'}
                        onChange={(e) => handleAdminUpdateUserRole(user.id, e.target.value)}
                        disabled={user.email === 'maresj1411@gmail.com'}
                        className="px-2 py-1.5 bg-[#0B0F19] border border-white/5 rounded-lg text-white text-[10px] focus:border-purple-500/40 focus:outline-none disabled:opacity-50"
                      >
                        <option value="user">Usuario</option>
                        <option value="encargado">Encargado</option>
                        <option value="admin">Administrador</option>
                      </select>
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
