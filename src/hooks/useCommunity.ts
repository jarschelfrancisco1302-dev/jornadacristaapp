import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { COMMUNITY_POSTS } from '../data';

export function useCommunity(session: any, showToast: (msg: string) => void) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      if (!session) return;
      const today = new Date().toISOString().split('T')[0];

      // Verifica posts de IA diários
      const { count: aiCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_ai', true)
        .gte('created_at', today);

      if (aiCount === 0) {
        const daySeed = new Date().getDate();
        const seededPosts = [];
        for (let i = 0; i < 3; i++) {
          const mockIdx = (daySeed + i) % COMMUNITY_POSTS.length;
          const mp = COMMUNITY_POSTS[mockIdx];
          seededPosts.push({
            is_ai: true,
            ai_user_name: mp.user,
            ai_avatar_url: mp.avatar,
            text: mp.text,
            image_url: mp.image || null,
            created_at: new Date().toISOString()
          });
        }
        await supabase.from('community_posts').insert(seededPosts);
      }

      // Buscar todos os posts relevantes
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(name, avatar_url)')
        .or(`is_ai.eq.true,user_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [session]);

  const handleCreatePost = async (text: string, imageUrl: string) => {
    if (!text.trim()) return;
    setIsPosting(true);

    try {
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase.from('community_posts').insert({
        user_id: session.user.id,
        text: text,
        image_url: imageUrl || null
      });

      if (error) throw error;

      showToast("Post publicado com sucesso!");
      fetchPosts();
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  return { posts, isPosting, handleCreatePost };
}
