import React from 'react';
import { motion } from 'motion/react';
import { Award, Flame, CheckCircle, Calendar } from 'lucide-react';
import { Card, SectionHeader } from '../components/Shared';
import { useUserProgress } from '../hooks/useUserProgress';

export default function ProgressTab({ session }: { session: any }) {
  const { profile, completedDays } = useUserProgress(session);

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
            animate={{ width: `${Math.min((profile?.progress || 0) / 20, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
          />
        </div>
      </Card>

      {/* Streak and Count */}
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
          <span className="text-3xl font-bold text-stone-800">{profile?.devotionals_count || 0}</span>
          <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">Devocionais Lidos</span>
        </Card>
      </div>

      {/* Calendar Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2">
            <Calendar size={18} className="text-blue-900" />
            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-stone-400 text-xs font-bold">{d}</span>
          ))}
          {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate();
            const isCompleted = completedDays.includes(day);

            return (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-xs transition-all duration-300
                  ${isToday ? 'border-2 border-blue-900' : ''}
                  ${isCompleted ? 'bg-green-500 text-white font-bold shadow-md' : 'text-stone-300'}
                  ${isToday && isCompleted ? 'bg-green-600 border-none' : ''}
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
}
