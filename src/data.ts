import {
  BookOpen,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Award,
  Calendar,
  User,
  Home,
  BarChart2,
  Users,
  Copy,
  Flame,
  Shield,
  Star,
  Sun,
  Moon,
  Coffee,
  Music
} from 'lucide-react';

export const ORDER_BUMPS = [
  {
    id: 1,
    title: "Plano Bíblico 30 Dias",
    description: "Disciplina Espiritual para transformar sua rotina.",
    price: "R$ 29,90",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/3cdc0e37-fadc-4b48-9313-80e435d4f6ca"
  },
  {
    id: 8,
    title: "Reestruturação do Casamento",
    description: "Restaure a aliança e a harmonia no seu lar.",
    price: "R$ 59,90",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/a5aa63b6-672e-432d-8655-3f68d712bfa0"
  },
  {
    id: 7,
    title: "Liderança Familiar",
    description: "Como guiar sua casa nos caminhos do Senhor.",
    price: "R$ 49,90",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/79b9d417-d05e-4b2c-b444-10da7dccb521"
  },
  {
    id: 2,
    title: "Desafio 21 Dias de Oração",
    description: "Aprofunde sua conexão com Deus.",
    price: "R$ 19,90",
    image: "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/cb964de0-bc3a-4177-bef0-bd1cb4952bc5"
  },
  {
    id: 3,
    title: "Guia Completo de Jejum",
    description: "Aprenda a jejuar com propósito bíblico.",
    price: "R$ 24,90",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/564cfe2c-85d6-458a-be20-6592d7458c7c"
  },
  {
    id: 4,
    title: "Devocional para Homens",
    description: "Força e sabedoria para o dia a dia.",
    price: "R$ 34,90",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/76687598-7980-4ab6-922d-318de3162a51"
  },
  {
    id: 5,
    title: "Devocional para Mulheres",
    description: "Graça e virtude em cada página.",
    price: "R$ 34,90",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/503c6b92-4154-487c-85d0-0e3e466dacce"
  },
  {
    id: 6,
    title: "Guia de Relacionamentos",
    description: "Princípios cristãos para o amor.",
    price: "R$ 39,90",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    checkoutUrl: "https://pay.kirvano.com/45ed4b9c-cce2-489b-850d-0de4f23847cb"
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    user: "Ana Clara",
    time: "2h atrás",
    text: "Começando o dia na presença dEle. Não há lugar melhor para estar! 🙏✨",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 124,
    comments: 12,
    avatar: "https://i.pravatar.cc/150?u=ana"
  },
  {
    id: 2,
    user: "Pr. Marcos Souza",
    time: "4h atrás",
    text: "Culto de jovens ontem foi sobrenatural. O Espírito Santo se moveu poderosamente!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 342,
    comments: 45,
    avatar: "https://i.pravatar.cc/150?u=marcos"
  },
  {
    id: 3,
    user: "Júlia Costa",
    time: "5h atrás",
    text: "Salmos 23:1 - O Senhor é o meu pastor, nada me faltará. Quem crê digita amém! 👇",
    image: "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 890,
    comments: 156,
    avatar: "https://i.pravatar.cc/150?u=julia"
  },
  {
    id: 4,
    user: "Lucas Silva",
    time: "6h atrás",
    text: "Meu momento de café com a Palavra. Renovando as forças.",
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 210,
    comments: 23,
    avatar: "https://i.pravatar.cc/150?u=lucas"
  },
  {
    id: 5,
    user: "Beatriz Oliveira",
    time: "8h atrás",
    text: "Pedindo oração pela minha família. Estamos passando por um momento difícil, mas cremos na vitória.",
    image: null,
    likes: 456,
    comments: 89,
    avatar: "https://i.pravatar.cc/150?u=beatriz"
  },
  {
    id: 6,
    user: "Grupo Jovem Atitude",
    time: "10h atrás",
    text: "Nossa vigília foi incrível! Deus é bom o tempo todo.",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 156,
    comments: 10,
    avatar: "https://i.pravatar.cc/150?u=grupo"
  },
  {
    id: 7,
    user: "Carlos Eduardo",
    time: "12h atrás",
    text: "A natureza revela a glória de Deus. Olhem esse pôr do sol!",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 567,
    comments: 34,
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    id: 8,
    user: "Mariana Santos",
    time: "1d atrás",
    text: "Estudando o livro de Ester. Que exemplo de coragem!",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 234,
    comments: 18,
    avatar: "https://i.pravatar.cc/150?u=mariana"
  },
  {
    id: 9,
    user: "Felipe Mendes",
    time: "1d atrás",
    text: "Gratidão por mais um dia de vida. Deus é fiel.",
    image: null,
    likes: 123,
    comments: 5,
    avatar: "https://i.pravatar.cc/150?u=felipe"
  },
  {
    id: 10,
    user: "Amanda Lima",
    time: "1d atrás",
    text: "Louvor que não sai da minha cabeça hoje: 'Caminho no deserto...' 🎶",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 345,
    comments: 42,
    avatar: "https://i.pravatar.cc/150?u=amanda"
  },
  {
    id: 11,
    user: "Roberto Dias",
    time: "2d atrás",
    text: "Servindo na ação social da igreja. Amar ao próximo é amar a Deus.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 678,
    comments: 56,
    avatar: "https://i.pravatar.cc/150?u=roberto"
  },
  {
    id: 12,
    user: "Carla Souza",
    time: "2d atrás",
    text: "Minha bíblia de anotações está ficando cheia! Amo aprender mais.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 432,
    comments: 29,
    avatar: "https://i.pravatar.cc/150?u=carla"
  },
  {
    id: 13,
    user: "Pedro Henrique",
    time: "3d atrás",
    text: "Oração em família. A base de tudo.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 890,
    comments: 78,
    avatar: "https://i.pravatar.cc/150?u=pedro"
  },
  {
    id: 14,
    user: "Sofia Martins",
    time: "3d atrás",
    text: "Testemunho: Consegui meu emprego novo! Deus abriu as portas onde não havia.",
    image: null,
    likes: 1200,
    comments: 230,
    avatar: "https://i.pravatar.cc/150?u=sofia"
  },
  {
    id: 15,
    user: "Thiago Almeida",
    time: "4d atrás",
    text: "Refletindo sobre a cruz. Foi por amor a nós.",
    image: "https://images.unsplash.com/photo-1543702404-2e700b55f699?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 543,
    comments: 45,
    avatar: "https://i.pravatar.cc/150?u=thiago"
  }
];

export const MESSAGES = [
  { category: "Fé", text: "A fé não torna as coisas fáceis, torna-as possíveis. Lucas 1:37" },
  { category: "Gratidão", text: "Dêem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus. 1 Tessalonicenses 5:18" },
  { category: "Perseverança", text: "Mas os que esperam no Senhor renovarão as forças. Isaías 40:31" },
  { category: "Amor", text: "O amor é paciente, o amor é bondoso. 1 Coríntios 13:4" },
  { category: "Família", text: "Eu e a minha casa serviremos ao Senhor. Josué 24:15" }
];

export const MOCK_PROFILE = {
  name: "Visitante",
  bio: "Amante da palavra e seguidor de Cristo. Buscando crescer a cada dia.",
  favoriteVerse: "Filipenses 4:13",
  streak: 1,
  level: "Discípulo",
  progress: 35,
  medals: ["Leitor Fiel", "Oração Matinal", "Doador"]
};
