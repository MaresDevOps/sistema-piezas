import React from 'react';
import { X, User, Lock, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authMode, 
    setAuthMode, 
    authForm, 
    setAuthForm, 
    authError, 
    handleAuthSubmit 
  } = useAuth();

  if (!showAuthModal) return null;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      
      const isSuperAdmin = user.email === 'maresj1411@gmail.com';
      const isGoogleAdmin = user.email.toLowerCase().includes('jorge') || user.email.toLowerCase().includes('mares');
      const isAdmin = isSuperAdmin || isGoogleAdmin;

      if (!profileSnap.exists()) {
        const userProfile = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          username: user.email.split('@')[0],
          rank: isAdmin ? 'Administrator' : 'Rig Builder Rookie',
          avatarColor: isAdmin ? 'from-purple-600 to-indigo-600' : 'from-purple-500 to-pink-500',
          role: isAdmin ? 'admin' : 'user'
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      setShowAuthModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error con Google Login: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
      
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#151C2C] p-8 shadow-2xl z-10 animate-zoomIn overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none"></div>

        <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B0F19] border border-white/5 shadow-inner mb-4">
            <User className="h-8 w-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {authMode === 'login' ? 'Acceso al Sistema' : 'Nuevo Operador'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {authMode === 'login' ? 'Ingresa tus credenciales de Nexus' : 'Regístrate para ensamblar hardware'}
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-red-400 text-xs font-bold">{authError}</p>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs relative">
          {authMode === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    required 
                    type="text" 
                    placeholder="Sofía Martínez" 
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none transition-colors" 
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
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none transition-colors" 
                  />
                </div>
              </div>
            </>
          )}

          {authMode === 'login' && (
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
                  className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none transition-colors" 
                />
              </div>
            </div>
          )}

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
                className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none transition-colors" 
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-1.5 mt-2"
          >
            {authMode === 'login' ? <User className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
          </button>

          <div className="relative flex py-2 items-center text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-4">
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
  );
}
