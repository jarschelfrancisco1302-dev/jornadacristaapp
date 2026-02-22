import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BarChart2,
  Users,
  User,
  Share2,
  Copy,
  CheckCircle,
  Heart,
  MessageCircle,
  PlusSquare,
  Settings,
  Award,
  Calendar,
  ChevronRight,
  BookOpen,
  Flame,
  Lock,
  X,
  LogOut
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import { ORDER_BUMPS, MESSAGES } from './data';
import { getVerseReflection, getDailyVerse } from './aiService';

// --- Components ---

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 border border-white/10"
  >
    <CheckCircle size={18} className="text-green-400" />
    <span className="text-sm font-medium tracking-tight">{message}</span>
  </motion.div>
);

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

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-serif font-bold text-blue-900 tracking-tight leading-tight">{title}</h2>
    {subtitle && <p className="text-sm text-stone-400 font-medium mt-1">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`premium-card p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// --- Tabs ---

const HomeTab = ({ profile, dailyContent, showToast }: any) => {
  const [markedDone, setMarkedDone] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (dailyContent?.reflection) {
      setAiReflection(dailyContent.reflection);
    }
  }, [dailyContent]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Texto copiado para a área de transferência!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Jornada Cristã',
        text: 'Confira este versículo do dia!',
        url: window.location.href,
      }).catch(() => showToast("Link copiado!"));
    } else {
      handleCopy("Confira este versículo do dia!");
    }
  };

  const handleBuy = (title: string) => {
    showToast(`"${title}" adicionado ao carrinho!`);
  };

  const generateReflection = async () => {
    if (!dailyContent?.verse) return;
    setIsGenerating(true);
    const reflection = await getVerseReflection(dailyContent.verse);
    setAiReflection(reflection);
    setIsGenerating(false);

    // Save to daily_content if it's currently null
    if (!dailyContent.reflection) {
      await supabase.from('daily_content').update({ reflection }).eq('id', new Date().toISOString().split('T')[0]);
    }
  };

  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6 pb-24 pt-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-stone-500 font-medium">{today}</p>
          <h1 className="text-2xl font-serif font-bold text-blue-900">A Paz do Senhor, {profile?.name?.split(' ')[0] || 'Visitante'}</h1>
        </div>
        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-700">{profile?.streak || 0}</span>
        </div>
      </div>

      {/* Verse of the Day */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white border-none shadow-2xl shadow-blue-900/30 min-h-[220px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <BookOpen size={140} />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20">
              Versículo do Dia
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handleCopy(dailyContent?.verse || '')}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-90"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-90"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <p className="text-xl font-serif leading-relaxed mb-6 font-medium italic">
            {dailyContent?.verse || "Carregando a Palavra..."}
          </p>
          <div className="flex items-center space-x-2 opacity-90">
            <div className="w-8 h-[1px] bg-white/40" />
            <p className="text-xs font-bold tracking-widest uppercase">Palavra Viva</p>
          </div>
        </div>
      </Card>

      {/* AI Reflection Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Reflexão com IA" subtitle="Palavras personalizadas para você" />
          <button
            onClick={generateReflection}
            disabled={isGenerating || !dailyContent?.verse}
            className="p-2 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            <Flame size={20} className={isGenerating ? 'animate-pulse' : ''} />
          </button>
        </div>

        <AnimatePresence>
          {aiReflection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl"
            >
              <p className="text-stone-700 italic text-sm leading-relaxed font-medium">
                "{aiReflection}"
              </p>
              <div className="mt-3 flex justify-end">
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Gerado por IA</span>
              </div>
            </motion.div>
          )}
          {!aiReflection && !isGenerating && (
            <button
              onClick={generateReflection}
              className="w-full py-6 border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:border-indigo-300 transition-colors"
            >
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                <Flame size={24} className="text-stone-400 group-hover:text-indigo-500" />
              </div>
              <span className="text-sm font-bold text-stone-500 group-hover:text-indigo-600 uppercase tracking-widest">Obter reflexão espiritual</span>
            </button>
          )}
          {isGenerating && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Consultando a sabedoria...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Daily Devotional */}
      <div>
        <SectionHeader title="Devocional Diário" subtitle="Uma palavra para seu coração hoje" />
        <Card className="hover:shadow-md transition-shadow duration-300">
          <h3 className="font-bold text-lg text-stone-800 mb-2">Confiança em Tempos de Incerteza</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Muitas vezes nos preocupamos com o amanhã, mas Deus já está lá. A confiança não é saber o que vai acontecer, mas saber QUEM está no controle. Hoje, entregue suas ansiedades e descanse na soberania do Pai.
          </p>
          <button
            onClick={() => {
              setMarkedDone(!markedDone);
              if (!markedDone) showToast("Devocional concluído! +50 XP");
            }}
            className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${markedDone
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-900 text-white shadow-md hover:bg-blue-800 hover:shadow-lg active:scale-[0.98]'
              }`}
          >
            {markedDone ? <CheckCircle size={20} /> : <div className="w-5 h-5 border-2 border-white/30 rounded-full" />}
            <span className="font-medium">{markedDone ? 'Concluído hoje' : 'Marcar como lido'}</span>
          </button>
        </Card>
      </div>

      {/* Shareable Messages */}
      <div>
        <SectionHeader title="Mensagens para Compartilhar" />
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {MESSAGES.map((msg, idx) => (
            <div key={idx} className="min-w-[260px] bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col justify-between h-[180px] hover:border-amber-200 transition-colors shadow-sm">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-2 py-1 rounded-md">{msg.category}</span>
                <p className="mt-3 text-stone-800 font-serif italic text-sm leading-relaxed">"{msg.text}"</p>
              </div>
              <button
                onClick={() => handleCopy(msg.text)}
                className="self-end flex items-center space-x-1 text-amber-700 text-xs font-medium hover:bg-amber-100 px-3 py-2 rounded-lg transition-colors"
              >
                <Copy size={14} />
                <span>Copiar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Plan */}
      <div>
        <SectionHeader title="Plano de Leitura" subtitle="Continuar: Evangelho de João" />
        <Card className="flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="font-bold text-stone-800">Dia 12</h4>
              <p className="text-xs text-stone-500">João 14-16</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-24 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[40%]" />
            </div>
            <span className="text-xs font-bold text-blue-600">40%</span>
          </div>
        </Card>
      </div>

      {/* Order Bumps Section */}
      <div className="pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <Flame className="text-amber-500 fill-amber-500" size={20} />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">Aprofunde sua Jornada</h2>
        </div>
        <p className="text-sm text-stone-500 mb-4 px-1">
          Invista no seu crescimento espiritual com nossos materiais exclusivos. <span className="text-amber-600 font-bold">Oferta especial por tempo limitado!</span>
        </p>
        <div className="grid grid-cols-1 gap-4">
          {ORDER_BUMPS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex hover:shadow-md transition-shadow duration-300">
              <div className="w-1/3 relative group aspect-[3/4]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-800 leading-tight mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-blue-900 text-sm">{item.price}</span>
                  <button
                    onClick={() => handleBuy(item.title)}
                    className="bg-stone-900 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors active:scale-95"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgressTab = ({ profile }: any) => {
  return (
    <div className="space-y-6 pb-24 pt-6 px-4">
      <SectionHeader title="Meu Progresso" subtitle="Sua caminhada espiritual" />

      {/* Main Stats Card */}
      <Card className="bg-gradient-to-br from-stone-900 to-stone-800 text-white border-none shadow-xl shadow-stone-900/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
              <Award className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">Nível Atual</p>
              <h3 className="text-xl font-bold">{profile?.level || 'Discípulo'}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">Próximo</p>
            <h3 className="text-sm font-medium text-stone-300">Servo</h3>
          </div>
        </div>

        <div className="mb-2 flex justify-between text-xs font-medium text-stone-400">
          <span>XP Atual</span>
          <span>{profile?.progress || 0} / 2000</span>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(profile?.progress || 0) / 20}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
          />
        </div>
      </Card>

      {/* Streak */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-6 border-orange-100 bg-orange-50/50">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2 shadow-sm">
            <Flame size={24} className="fill-orange-600" />
          </div>
          <span className="text-3xl font-bold text-stone-800">{profile?.streak || 0}</span>
          <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">Dias de Ofensiva</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6 border-blue-100 bg-blue-50/50">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2 shadow-sm">
            <CheckCircle size={24} />
          </div>
          <span className="text-3xl font-bold text-stone-800">5</span>
          <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">Devocionais Lidos</span>
        </Card>
      </div>

      {/* Calendar Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2">
            <Calendar size={18} className="text-blue-900" />
            Fevereiro 2026
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-stone-400 text-xs font-bold">{d}</span>
          ))}
          {Array.from({ length: 28 }).map((_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate();
            const isCompleted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19].includes(day);

            return (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-xs transition-all duration-300
                  ${isToday ? 'bg-blue-900 text-white font-bold shadow-md scale-110' : ''}
                  ${isCompleted && !isToday ? 'bg-green-100 text-green-700 font-medium' : ''}
                  ${!isCompleted && !isToday ? 'text-stone-300' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const CommunityTab = ({ showToast }: { showToast: (msg: string) => void }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles(name, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        text: newPostText,
      });

      if (error) throw error;

      setNewPostText('');
      showToast("Post publicado com sucesso!");
      fetchPosts();
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
      showToast("Você curtiu este post!");
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-6 bg-stone-50 min-h-screen">
      <div className="px-4 flex justify-between items-center sticky top-0 bg-stone-50/95 backdrop-blur-sm z-10 py-2 border-b border-stone-100">
        <h2 className="text-xl font-serif font-bold text-blue-900">Comunidade</h2>
        <div className="flex bg-white rounded-full px-4 py-2 shadow-sm border border-stone-100 flex-1 mx-4">
          <input
            type="text"
            placeholder="Compartilhe uma palavra..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="bg-transparent text-sm w-full outline-none"
          />
          <button
            onClick={handleCreatePost}
            disabled={isPosting || !newPostText.trim()}
            className="text-blue-900 disabled:opacity-30"
          >
            <PlusSquare size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-0 overflow-hidden border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="p-4 flex items-center space-x-3">
                <div className="relative">
                  <img src={post.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${post.user_id}`} alt={post.profiles?.name} className="w-10 h-10 rounded-full object-cover border border-stone-100" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">{post.profiles?.name || 'Usuário'}</h4>
                  <p className="text-xs text-stone-400">{new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="text-stone-700 text-sm leading-relaxed mb-3">{post.text}</p>
              </div>

              {/* Post Actions */}
              <div className="p-4 flex items-center justify-between border-t border-stone-50">
                <div className="flex space-x-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    <Heart size={20} className={`transition-transform duration-200 ${likedPosts.includes(post.id) ? 'fill-current scale-110' : ''}`} />
                    <span>{post.likes_count + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                    className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${expandedComments === post.id ? 'text-blue-900' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    <MessageCircle size={20} />
                    <span>{post.comments_count}</span>
                  </button>
                </div>
                <button
                  onClick={() => showToast("Link copiado!")}
                  className="text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchProfileAndStreak = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      setProfile(data);

      const today = new Date().toISOString().split('T')[0];
      const lastCheckIn = data.last_check_in;

      if (lastCheckIn !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastCheckIn === yesterdayStr) {
          newStreak = (data.streak || 0) + 1;
        }

        await supabase.from('profiles').update({
          streak: newStreak,
          last_check_in: today
        }).eq('id', userId);

        setProfile({ ...data, streak: newStreak });
        showToast(`Ofensiva atualizada: ${newStreak} dias!`);
      }
    } catch (e: any) {
      console.error('Erro ao buscar perfil:', e);
    }
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
        // Only attempt to generate if session exists to avoid unnecessary 401s
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
    // Check if Supabase is configured
    const url = (import.meta as any).env.VITE_SUPABASE_URL;
    const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("Supabase config missing");
      setError("Configuração do Supabase não encontrada. Verifique se o arquivo .env existe e contém as chaves necessárias.");
      setLoading(false);
      return;
    }

    // Wrap initialization in try-catch
    const initApp = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession) {
          await Promise.all([
            fetchProfileAndStreak(currentSession.user.id),
            fetchDailyContent()
          ]);
        }

        setLoading(false);
      } catch (e: any) {
        console.error("Erro na inicialização:", e);
        setError("Não foi possível conectar ao banco de dados. Verifique sua conexão ou as chaves no arquivo .env.");
        setLoading(false);
      }
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        fetchProfileAndStreak(newSession.user.id);
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
    return <Auth onSession={setSession} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-stone-200">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>

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
              <HomeTab profile={profile} dailyContent={dailyContent} showToast={showToast} />
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
              <ProgressTab profile={profile} />
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
              <CommunityTab showToast={showToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile/Logout Floating Button */}
      <button
        onClick={() => supabase.auth.signOut()}
        className="fixed top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-stone-100 text-stone-400 hover:text-red-500 transition-colors"
        title="Sair"
      >
        <LogOut size={20} />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-nav h-[85px] px-8 pb-6 pt-2 flex justify-between items-center z-50">
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
      </div>
    </div>
  );
}
