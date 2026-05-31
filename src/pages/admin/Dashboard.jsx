import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, PackageCheck, AlertTriangle, ListOrdered, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useProducts } from '../../context/ProductContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { products } = useProducts();
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id });
      });
      setAllOrders(list);
    });
    return () => unsubscribe();
  }, []);

  const chartData = useMemo(() => {
    const dataMap = {};
    allOrders.forEach(order => {
      const date = order.createdAt?.slice(0, 10) || 'N/A';
      if (!dataMap[date]) {
        dataMap[date] = { date, ingresos: 0, ordenes: 0 };
      }
      dataMap[date].ingresos += (order.total || 0);
      dataMap[date].ordenes += 1;
    });
    // Reverse because query is desc, we want asc for charts (left to right)
    return Object.values(dataMap).sort((a,b) => a.date.localeCompare(b.date));
  }, [allOrders]);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-black text-white flex items-center space-x-2"><TrendingUp className="h-5 w-5 text-purple-400" /><span>Resumen de Ventas</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Orders by status */}
        {[['Recibido', 1, 'text-cyan-400', 'bg-cyan-500/10 border-cyan-500/20'], ['En Ensamblaje', 2, 'text-yellow-400', 'bg-yellow-500/10 border-yellow-500/20'], ['En Tránsito', 3, 'text-orange-400', 'bg-orange-500/10 border-orange-500/20'], ['Entregado', 4, 'text-emerald-400', 'bg-emerald-500/10 border-emerald-500/20']].map(([label, status, color, bg]) => (
          <div key={status} className={`p-5 rounded-2xl border glass-panel ${bg} flex items-center justify-between`}>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
              <p className={`text-3xl font-black mt-1 ${color}`}>{allOrders.filter(o => o.status === status).length}</p>
            </div>
            <PackageCheck className={`h-8 w-8 opacity-30 ${color}`} />
          </div>
        ))}
        <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 glass-panel flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stock bajo (≤5)</p>
            <p className="text-3xl font-black mt-1 text-red-400">{products.filter(p => p.stock <= 5).length}</p>
          </div>
          <AlertTriangle className="h-8 w-8 opacity-30 text-red-400" />
        </div>
        <div className="p-5 rounded-2xl border border-white/5 glass-panel flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ingresos totales</p>
            <p className="text-2xl font-black mt-1 text-white">${allOrders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <TrendingUp className="h-8 w-8 opacity-20 text-white" />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-[#151C2C]/40 p-6 glass-panel">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-sm">Evolución de Ingresos</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="ingresos" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#0B0F19', stroke: '#22d3ee', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#151C2C]/40 p-6 glass-panel">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <h3 className="font-extrabold text-white text-sm">Volumen de Pedidos</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                />
                <Bar dataKey="ordenes" fill="#c084fc" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent orders mini-table */}
      <div className="rounded-2xl border border-white/5 bg-[#151C2C]/40 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm flex items-center space-x-2"><ListOrdered className="h-4 w-4 text-purple-400" /><span>Últimos Pedidos</span></h3>
          <Link to="/admin/orders" className="text-[10px] text-purple-400 hover:underline font-bold">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0B0F19]/60">
              <tr>
                {['Código', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {allOrders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.buyerName}</td>
                  <td className="px-4 py-3 font-bold text-white">${order.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 4 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : order.status === 3 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : order.status === 2 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {['', 'Recibido', 'Ensamblaje', 'En Tránsito', 'Entregado'][order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{order.createdAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {allOrders.length === 0 && (
            <div className="text-center py-10 text-slate-600 text-xs">Sin pedidos registrados aún.</div>
          )}
        </div>
      </div>
    </div>
  );
}
