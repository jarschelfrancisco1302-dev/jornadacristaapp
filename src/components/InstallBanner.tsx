import React from 'react';
import { motion } from 'motion/react';
import { PlusSquare } from 'lucide-react';

interface InstallBannerProps {
    installApp: (() => void) | null;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ installApp }) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group mb-6"
        >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <PlusSquare size={120} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1 pr-4">
                    <h3 className="font-bold text-lg leading-tight mb-1 font-serif">Acesso Rápido</h3>
                    {installApp ? (
                        <p className="text-white/70 text-xs">Instale o app e facilite seu acesso diário.</p>
                    ) : (isIOS || isSafari) ? (
                        <p className="text-white/70 text-xs">Toque em <span className="font-bold underline">Compartilhar</span> e depois em <span className="font-bold underline">Adicionar à Tela de Início</span>.</p>
                    ) : (
                        <p className="text-white/70 text-xs">Use o Chrome ou Edge para instalar este aplicativo.</p>
                    )}
                </div>
                {installApp && (
                    <button
                        onClick={installApp}
                        className="bg-white text-blue-900 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all whitespace-nowrap"
                    >
                        Baixar Aplicativo
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default InstallBanner;
