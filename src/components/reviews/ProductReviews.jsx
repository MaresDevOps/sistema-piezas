import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Star, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductReviews({ productId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      let totalRating = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        list.push({ id: doc.id, ...data });
        totalRating += data.rating;
      });
      setReviews(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Debes iniciar sesión para dejar una reseña.");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Por favor escribe un comentario.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: currentUser.uid,
        userName: currentUser.name,
        userAvatarColor: currentUser.avatarColor || 'from-slate-500 to-slate-700',
        rating: newRating,
        comment: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setNewRating(5);
      toast.success("¡Reseña publicada con éxito!");
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("Error al publicar la reseña.");
    }
    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="bg-[#151C2C]/50 border border-white/5 rounded-3xl p-6 md:p-10 glass-panel space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-white tracking-tight">Reseñas de Clientes</h2>
        </div>
        
        <div className="flex items-center space-x-4 bg-[#0B0F19] p-4 rounded-2xl border border-white/5">
          <div className="text-center">
            <span className="text-3xl font-black text-white">{averageRating}</span>
            <span className="text-slate-500 text-xs font-bold block">de 5.0</span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-slate-600'}`} />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-bold">{reviews.length} valoraciones</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitReview} className="bg-[#0B0F19]/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Escribe tu opinión</h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tu Calificación:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`p-1 transition-transform hover:scale-110 ${star <= newRating ? 'text-amber-400' : 'text-slate-600'}`}
                >
                  <Star className={`h-6 w-6 ${star <= newRating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="¿Qué te pareció este producto? Comparte tu experiencia con otros compradores..."
            className="w-full bg-[#151C2C] border border-white/5 hover:border-white/10 focus:border-cyan-500/40 rounded-xl p-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-500 min-h-[100px] resize-none"
          ></textarea>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Reseña'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#0B0F19]/50 p-6 rounded-2xl border border-white/5 text-center space-y-2">
          <p className="text-sm text-slate-400 font-bold">Inicia sesión para dejar una reseña.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="bg-[#0B0F19] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${review.userAvatarColor || 'from-slate-500 to-slate-700'} flex items-center justify-center text-xs font-extrabold text-white uppercase`}>
                    {review.userName?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{review.userName || 'Usuario Anónimo'}</div>
                    <div className="text-[10px] text-slate-500">{review.createdAt?.toDate().toLocaleDateString() || 'Hace un momento'}</div>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-11">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm italic">
            Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
          </div>
        )}
      </div>
    </div>
  );
}
