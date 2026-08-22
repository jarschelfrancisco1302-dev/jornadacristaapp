import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BarChart2,
  Users,
  X,
  Compass,
  User
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import HomeTab from './pages/Home';
import ProgressTab from './pages/Progress';
import CommunityTab from './pages/Community';
import ExploreTab from './pages/Explore';
import ProfileTab from './pages/Profile';
import { Toast } from './components/Shared';
import { getDailyVerse, getVerseReflection } from './aiService';
import { useUserProgress } from './hooks/useUserProgress';
import { useOrderBump } from './hooks/useOrderBump';
import OrderBumpModal from './components/OrderBumpModal';

const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${active ? 'text-blue-900' : 'text-stone-400 hover:text-stone-600'
      }`}
  >
    <motion.div
      animate={{ scale: active ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </motion.div>
    <span className={`text-[10px] font-semibold tracking-wide uppercase transition-all ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    {active && (
      <motion.div
        layoutId="tab-indicator"
        className="absolute -top-2 w-1 h-1 bg-blue-900 rounded-full"
      />
    )}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [session, setSession] = useState<any>(null);
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Hook para perfil
  const { profile, setProfile } = useUserProgress(session);
  // Hook para order bumps
  const { activeBump, closeBump, triggerBump } = useOrderBump();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchDailyContent = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error: fetchError } = await supabase
        .from('daily_content')
        .select('*')
        .eq('id', today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setDailyContent(data);
      } else {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) return;

        const verse = await getDailyVerse();
        const reflection = await getVerseReflection(verse);

        const { data: newData, error: insertError } = await supabase
          .from('daily_content')
          .insert({
            id: today,
            verse: verse,
            reflection: reflection
          })
          .select()
          .maybeSingle();

        if (!insertError && newData) setDailyContent(newData);
      }
    } catch (e: any) {
      console.error('Erro ao buscar conteúdo diário:', e);
    }
  };

  useEffect(() => {
    const url = (import.meta as any).env.VITE_SUPABASE_URL;
    const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("Supabase config missing");
      setError("Configuração do Supabase não encontrada. Verifique se o arquivo .env existe e contém as chaves necessárias.");
      setLoading(false);
      return;
    }

    const initApp = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession) {
          await fetchDailyContent();
        }
        setLoading(false);
      } catch (e: any) {
        console.error("Erro na inicialização:", e);
        setError("Não foi possível conectar ao banco de dados.");
        setLoading(false);
      }
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        fetchDailyContent();
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <X size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-stone-500 text-sm max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-xl font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!session) {
    return <Auth onSession={setSession} installApp={deferredPrompt ? handleInstall : null} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-stone-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>

      {/* Order Bump Modal */}
      <OrderBumpModal bump={activeBump} onClose={closeBump} />

      {/* Content Area */}
      <div className="h-full overflow-y-auto scrollbar-hide bg-stone-50/50">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <HomeTab
                profile={profile}
                setProfile={setProfile}
                dailyContent={dailyContent}
                showToast={showToast}
                installApp={deferredPrompt ? handleInstall : null}
                triggerBump={triggerBump}
              />
            </motion.div>
          )}
          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <ProgressTab session={session} />
            </motion.div>
          )}
          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <CommunityTab session={session} showToast={showToast} />
            </motion.div>
          )}
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <ExploreTab showToast={showToast} />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <ProfileTab profile={profile} session={session} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-stone-100 h-[85px] px-6 pb-6 pt-2 flex justify-between items-center z-50">
        <TabButton
          active={activeTab === 'home'}
          icon={Home}
          label="Início"
          onClick={() => setActiveTab('home')}
        />
        <TabButton
          active={activeTab === 'progress'}
          icon={BarChart2}
          label="Progresso"
          onClick={() => setActiveTab('progress')}
        />
        <TabButton
          active={activeTab === 'community'}
          icon={Users}
          label="Comunidade"
          onClick={() => setActiveTab('community')}
        />
        <TabButton
          active={activeTab === 'explore'}
          icon={Compass}
          label="Explorar"
          onClick={() => setActiveTab('explore')}
        />
        <TabButton
          active={activeTab === 'profile'}
          icon={User}
          label="Perfil"
          onClick={() => setActiveTab('profile')}
        />
      </div>
    </div>
  );
}
