import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-stone-900/90 dark:bg-stone-100/90 backdrop-blur-md text-white dark:text-stone-900 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 border border-white/10"
  >
    <CheckCircle size={18} className="text-green-400" />
    <span className="text-sm font-medium tracking-tight">{message}</span>
  </motion.div>
);

export const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-400 tracking-tight leading-tight">{title}</h2>
    {subtitle && <p className="text-sm text-stone-400 font-medium mt-1">{subtitle}</p>}
  </div>
);

export const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`premium-card bg-white dark:bg-stone-800 p-6 ${className}`}
  >
    {children}
  </motion.div>
);
