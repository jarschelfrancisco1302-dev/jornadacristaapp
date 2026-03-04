import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

interface AuthProps {
    onSession: (session: any) => void;
    installApp: (() => void) | null;
}

export default function Auth({ onSession, installApp }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (loginError) throw loginError;
                onSession(data.session);
            } else {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (signUpError) throw signUpError;
                if (data.session) {
                    onSession(data.session);
                } else {
                    setError('Cadastro realizado! Agora você já pode fazer login.');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
            {installApp && (
                <div className="w-full max-w-sm mb-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-lg leading-tight mb-1 font-serif">Acesso Rápido</h3>
                                <p className="text-white/70 text-xs">Instale o app e facilite seu acesso diário.</p>
                            </div>
                            <button
                                onClick={installApp}
                                className="bg-white text-blue-900 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all whitespace-nowrap"
                            >
                                Baixar Aplicativo
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl shadow-stone-200 border border-stone-100"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-900/20">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-blue-900">Jornada Cristã</h1>
                    {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all"
                                    required={!isLogin}
                                    autoComplete="name"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all"
                            required
                            autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                    </div>

                    {error && (
                        <div className={`p-4 rounded-xl text-xs font-medium flex items-center space-x-2 ${error.includes('sucesso') || error.includes('Cadastro') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            <CheckCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 text-white rounded-2xl py-4 font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{isLogin ? 'Entrar' : 'Começar Jornada'}</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-stone-400 text-sm font-medium hover:text-blue-900 transition-colors"
                    >
                        {isLogin ? (
                            <>Não tem uma conta? <span className="text-blue-900 font-bold">Cadastre-se</span></>
                        ) : (
                            <>Já tem uma conta? <span className="text-blue-900 font-bold">Entre aqui</span></>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
