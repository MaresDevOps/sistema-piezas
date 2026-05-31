import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // REAL AUTHENTICATION LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isSuperAdmin = firebaseUser.email === 'maresj1411@gmail.com';
        
        let userProfile = {
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          username: firebaseUser.email.split('@')[0],
          rank: isSuperAdmin ? 'Administrator' : 'Rig Builder Rookie',
          avatarColor: isSuperAdmin ? 'from-purple-600 to-indigo-600' : 'from-purple-500 to-pink-500',
          role: isSuperAdmin ? 'admin' : 'user'
        };

        try {
          const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileSnap.exists()) {
            userProfile = profileSnap.data();
            let needsUpdate = false;
            
            // Migrate legacy isAdmin to role
            if (userProfile.isAdmin !== undefined) {
               userProfile.role = userProfile.isAdmin ? 'admin' : 'user';
               delete userProfile.isAdmin;
               needsUpdate = true;
            }

            if (isSuperAdmin && userProfile.role !== 'admin') {
              userProfile.role = 'admin';
              userProfile.rank = 'Administrator';
              userProfile.avatarColor = 'from-purple-600 to-indigo-600';
              needsUpdate = true;
            }
            if (needsUpdate) {
              await updateDoc(doc(db, 'users', firebaseUser.uid), userProfile);
            }
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
          rank: authForm.email === 'maresj1411@gmail.com' ? 'Administrator' : 'Rig Builder Rookie',
          avatarColor: authForm.email === 'maresj1411@gmail.com' ? 'from-purple-600 to-indigo-600' : 'from-purple-500 to-pink-500',
          role: authForm.email === 'maresj1411@gmail.com' ? 'admin' : 'user'
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', username: '', password: '' });
        toast.success("¡Cuenta registrada con éxito!");
      } catch (err) {
        console.error(err);
        setAuthError('Error al registrar cuenta: ' + err.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (err) {
      console.error(err);
      setAuthError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      showAuthModal,
      setShowAuthModal,
      authMode,
      setAuthMode,
      authForm,
      setAuthForm,
      authError,
      setAuthError,
      handleAuthSubmit,
      handleLogout,
      handleGoogleLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
