import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useUserProgress(session: any) {
  const [profile, setProfile] = useState<any>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

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
      }
    } catch (e: any) {
      console.error('Erro ao buscar perfil:', e);
    }
  };

  const fetchHistory = async () => {
    if (!session) return;
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startStr = startOfMonth.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reading_history')
        .select('reading_date')
        .eq('user_id', session.user.id)
        .gte('reading_date', startStr);

      if (!error && data) {
        const days = data.map(d => new Date(d.reading_date + 'T00:00:00').getDate());
        setCompletedDays(days);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfileAndStreak(session.user.id);
      fetchHistory();
    }
  }, [session]);

  return { profile, setProfile, completedDays, fetchHistory };
}
