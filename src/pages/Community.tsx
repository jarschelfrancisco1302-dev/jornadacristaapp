import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, PlusSquare, ArrowRight } from 'lucide-react';
import { Card } from '../components/Shared';
import { useCommunity } from '../hooks/useCommunity';

export default function CommunityTab({ session, showToast }: { session: any, showToast: (msg: string) => void }) {
  const { posts, isPosting, handleCreatePost } = useCommunity(session, showToast);
  
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);

  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
      showToast("Você curtiu este post!");
    }
  };

  const onSubmit = () => {
    handleCreatePost(newPostText, newPostImage);
    setNewPostText('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-6 bg-stone-50 min-h-screen">
      <div className="px-4 sticky top-0 bg-stone-50/95 backdrop-blur-sm z-10 py-2 border-b border-stone-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-serif font-bold text-blue-900">Comunidade</h2>
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2 rounded-xl transition-colors ${showImageInput ? 'bg-blue-100 text-blue-900' : 'text-stone-400 hover:bg-stone-100'}`}
          >
            <PlusSquare size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex bg-white rounded-2xl px-4 py-3 shadow-sm border border-stone-100">
            <input
              type="text"
              placeholder="Compartilhe uma palavra..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="bg-transparent text-sm w-full outline-none"
            />
            <button
              onClick={onSubmit}
              disabled={isPosting || !newPostText.trim()}
              className="text-blue-900 disabled:opacity-30 pl-2"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          <AnimatePresence>
            {showImageInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex bg-white rounded-2xl px-4 py-3 shadow-sm border border-stone-100">
                  <input
                    type="url"
                    placeholder="URL da imagem (opcional)..."
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <img
                    src={post.is_ai ? post.ai_avatar_url : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format&fit=crop&q=60"}
                    alt={post.is_ai ? post.ai_user_name : post.profiles?.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-100"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">{post.is_ai ? post.ai_user_name : (post.profiles?.name || 'Eu')}</h4>
                  <p className="text-xs text-stone-400">
                    {post.is_ai ? 'Hoje' : new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="text-stone-700 text-sm leading-relaxed mb-3">{post.text}</p>
                {post.image_url && (
                  <div className="rounded-2xl overflow-hidden mb-3 border border-stone-100">
                    <img src={post.image_url} alt="Post content" className="w-full h-auto object-cover max-h-72" />
                  </div>
                )}
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
}
