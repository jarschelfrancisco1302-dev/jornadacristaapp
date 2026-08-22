import { useState, useEffect, useRef, useCallback } from 'react';
import { ORDER_BUMPS } from '../data';

const FIRST_SHOW_DELAY_MS = 30_000;   // 30 segundos após login
const REPEAT_INTERVAL_MS  = 3 * 60_000; // a cada 3 minutos

export function useOrderBump() {
  const [activeBump, setActiveBump] = useState<(typeof ORDER_BUMPS)[0] | null>(null);
  const lastBumpIdRef = useRef<number | null>(null);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickRandomBump = useCallback(() => {
    const pool = ORDER_BUMPS.filter((b) => b.id !== lastBumpIdRef.current);
    const bump = pool[Math.floor(Math.random() * pool.length)];
    lastBumpIdRef.current = bump.id;
    setActiveBump(bump);
  }, []);

  const closeBump = useCallback(() => setActiveBump(null), []);

  // Trigger manualmente (ex: após marcar devocional como lido)
  const triggerBump = useCallback(() => {
    closeBump();
    setTimeout(pickRandomBump, 400); // pequeno delay para não sobrepor animações
  }, [pickRandomBump, closeBump]);

  useEffect(() => {
    // Primeiro aparecimento após 30s
    const firstTimer = setTimeout(() => {
      pickRandomBump();

      // Depois, repete a cada 3 minutos
      intervalRef.current = setInterval(pickRandomBump, REPEAT_INTERVAL_MS);
    }, FIRST_SHOW_DELAY_MS);

    return () => {
      clearTimeout(firstTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pickRandomBump]);

  return { activeBump, closeBump, triggerBump };
}
