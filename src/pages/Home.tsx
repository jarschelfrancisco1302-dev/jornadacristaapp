import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Copy, Share2, Flame, CheckCircle, Volume2, Smile } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ORDER_BUMPS, MESSAGES } from '../data';
import { getVerseReflection, getPersonalizedReflection } from '../aiService';
import InstallBanner from '../components/InstallBanner';
import { Card, SectionHeader } from '../components/Shared';

export default function HomeTab({ profile, setProfile, dailyContent, showToast, installApp, triggerBump }: any) {
  const [markedDone, setMarkedDone] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [isReading, setIsReading] = useState(false);

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

  const handleBuy = (title: string, url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`"${title}" adicionado ao carrinho!`);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      showToast("Seu navegador não suporta leitura em voz alta.");
      return;
    }
    
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setIsReading(false);
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };

  const generateReflection = async () => {
    if (!dailyContent?.verse) return;
    setIsGenerating(true);
    
    let reflection = '';
    if (emotion.trim()) {
      reflection = await getPersonalizedReflection(emotion);
      showToast("Devocional personalizado gerado!");
    } else {
      reflection = await getVerseReflection(dailyContent.verse);
    }
    
    setAiReflection(reflection);
    setIsGenerating(false);

    // Save to daily_content if it's not personalized and currently null
    if (!emotion.trim() && !dailyContent.reflection) {
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

      <AnimatePresence>
        <InstallBanner installApp={installApp} />
      </AnimatePresence>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Devocionais</p>
          <p className="text-xl font-bold text-blue-900">{profile?.devotionals_count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Nível</p>
          <p className="text-xl font-bold text-blue-900">{profile?.level?.split(' ')[0] || 'Discípulo'}</p>
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
                onClick={() => speakText(dailyContent?.verse || '')}
                className={`p-2.5 rounded-xl transition-all active:scale-90 ${isReading ? 'bg-white/40 animate-pulse' : 'hover:bg-white/20'}`}
              >
                <Volume2 size={18} />
              </button>
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
          <SectionHeader title="Reflexão" subtitle="Palavras personalizadas para você" />
        </div>
        
        {/* Input de emoção para devocional personalizado */}
        <div className="mb-4 bg-white p-3 rounded-2xl flex items-center shadow-sm border border-stone-100">
          <Smile className="text-stone-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Como você está se sentindo hoje? (ex: Ansioso)"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <AnimatePresence>
          {aiReflection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-stone-700 italic text-sm leading-relaxed font-medium">
                  "{aiReflection}"
                </p>
                <button 
                  onClick={() => speakText(aiReflection)}
                  className={`ml-2 p-2 rounded-full ${isReading ? 'text-indigo-600 bg-indigo-100 animate-pulse' : 'text-stone-400 hover:text-indigo-500'}`}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) throw new Error('Not authenticated');

                    const today = new Date().toISOString().split('T')[0];

                    const newCount = (profile?.devotionals_count || 0) + 1;
                    const { data: updatedProfile, error: profileError } = await supabase.from('profiles').update({
                      devotionals_count: newCount,
                      progress: (profile?.progress || 0) + 30
                    }).eq('id', session.user.id).select().single();

                    if (profileError) throw profileError;

                    await supabase.from('reading_history').insert({
                      user_id: session.user.id,
                      reading_date: today
                    }).select().maybeSingle();

                    if (updatedProfile) setProfile(updatedProfile);

                    showToast("Reflexão concluída! +30 XP");
                    triggerBump?.(); // dispara order bump após marcar como lido
                  } catch (e: any) {
                    console.error(e);
                    showToast("Erro ao salvar progresso.");
                  }
                }}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <CheckCircle size={18} />
                <span>Marcar como lido</span>
              </button>
            </motion.div>
          )}
          {(!aiReflection || emotion) && !isGenerating && (
            <button
              onClick={generateReflection}
              className="w-full py-6 border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:border-indigo-300 transition-colors mt-4"
            >
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                <Flame size={24} className="text-stone-400 group-hover:text-indigo-500" />
              </div>
              <span className="text-sm font-bold text-stone-500 group-hover:text-indigo-600 uppercase tracking-widest">
                {emotion ? 'Gerar reflexão para este sentimento' : 'Obter reflexão espiritual'}
              </span>
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
                    onClick={() => handleBuy(item.title, (item as any).checkoutUrl)}
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
}
