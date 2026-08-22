import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Flame, Star } from 'lucide-react';

interface OrderBump {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  checkoutUrl: string;
}

interface OrderBumpModalProps {
  bump: OrderBump | null;
  onClose: () => void;
}

export default function OrderBumpModal({ bump, onClose }: OrderBumpModalProps) {
  if (!bump) return null;

  const handleBuy = () => {
    window.open(bump.checkoutUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {bump && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            key="modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[101] bg-white rounded-t-[32px] shadow-2xl overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-200 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Badge */}
            <div className="flex justify-center mt-1 mb-3">
              <span className="flex items-center space-x-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-amber-200">
                <Flame size={12} className="fill-amber-500 text-amber-500" />
                <span>Oferta Especial para Você</span>
                <Flame size={12} className="fill-amber-500 text-amber-500" />
              </span>
            </div>

            {/* Product Card */}
            <div className="px-6 pb-2">
              <div className="flex items-center space-x-4 bg-stone-50 rounded-2xl p-3 border border-stone-100">
                <img
                  src={bump.image}
                  alt={bump.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h3 className="font-bold text-stone-800 text-sm leading-tight">{bump.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{bump.description}</p>
                </div>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="px-6 pb-4 pt-3">
              <div className="flex items-baseline justify-center space-x-2 mb-1">
                <span className="text-xs text-stone-400 line-through">R$ 97,00</span>
                <span className="text-3xl font-bold text-blue-900">{bump.price}</span>
              </div>
              <p className="text-center text-xs text-stone-400 mb-4">Acesso imediato · Pagamento seguro</p>

              <button
                onClick={handleBuy}
                className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-900/30 hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Quero Aprofundar Minha Fé</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-stone-400 text-sm font-medium mt-2 hover:text-stone-600 transition-colors"
              >
                Não, obrigado
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
