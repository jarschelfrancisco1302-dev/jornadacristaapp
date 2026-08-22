import React from 'react';
import { LogOut, User, Award, Shield, CheckCircle, BarChart2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Card, SectionHeader } from '../components/Shared';
import { MOCK_PROFILE } from '../data';

export default function ProfileTab({ profile, session }: any) {
  const userEmail = session?.user?.email;
  const userName = profile?.name || MOCK_PROFILE.name;
  
  // Usamos os dados reais do banco ou os mockados do data.ts
  const level = profile?.level || MOCK_PROFILE.level;
  const progress = profile?.progress || 0;
  const streak = profile?.streak || 0;
  const devotionalsCount = profile?.devotionals_count || 0;
  
  return (
    <div className="space-y-8 pb-24 pt-6 px-4">
      {/* Header Profile */}
      <div className="flex flex-col items-center pt-4">
        <div className="w-24 h-24 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl">
          <User size={48} />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-800">{userName}</h1>
        <p className="text-sm text-stone-500">{userEmail}</p>
        <span className="mt-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100">
          Nível: {level}
        </span>
      </div>

      {/* Estatísticas */}
      <section>
        <SectionHeader title="Suas Estatísticas" />
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center justify-center bg-orange-50 border-orange-100">
            <div className="text-orange-500 mb-1">
              <Award size={24} />
            </div>
            <p className="text-2xl font-bold text-orange-700">{streak}</p>
            <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mt-1">Dias Seguidos</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center bg-blue-50 border-blue-100">
            <div className="text-blue-500 mb-1">
              <CheckCircle size={24} />
            </div>
            <p className="text-2xl font-bold text-blue-700">{devotionalsCount}</p>
            <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest mt-1">Devocionais</p>
          </Card>

          <Card className="p-4 flex flex-col items-center justify-center col-span-2 bg-emerald-50 border-emerald-100">
            <div className="text-emerald-500 mb-1">
              <BarChart2 size={24} />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{progress} XP</p>
            <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Experiência Total</p>
          </Card>
        </div>
      </section>

      {/* Conquistas (Medals) */}
      <section>
        <SectionHeader title="Medalhas" />
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {MOCK_PROFILE.medals.map((medal, idx) => (
            <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-200 w-[100px] h-[100px]">
              <Shield size={28} className="text-amber-500 mb-2" />
              <span className="text-xs font-bold text-stone-700 text-center leading-tight">{medal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Botão de Sair */}
      <section className="pt-6">
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold transition-colors flex items-center justify-center space-x-2 border border-red-100"
        >
          <LogOut size={20} />
          <span>Sair da Conta</span>
        </button>
      </section>
    </div>
  );
}
