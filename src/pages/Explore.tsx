import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book, PenTool, Lightbulb, Save, CheckCircle } from 'lucide-react';
import { SectionHeader, Card } from '../components/Shared';

const HEROES = [
  {
    name: "Davi",
    title: "O Homem Segundo o Coração de Deus",
    text: "De um simples pastor de ovelhas ao maior rei de Israel. Davi nos ensina que Deus não vê a aparência, mas o coração. Suas falhas foram muitas, mas seu arrependimento foi sempre sincero, nos deixando os belos Salmos como legado de adoração e dependência de Deus."
  },
  {
    name: "Ester",
    title: "A Rainha Corajosa",
    text: "Uma órfã judia que se tornou rainha do império persa. Ester arriscou sua própria vida para salvar seu povo do extermínio. Ela nos lembra que Deus nos coloca em posições estratégicas 'para um tempo como este', onde nossa coragem pode mudar a história."
  },
  {
    name: "Paulo",
    title: "O Apóstolo da Graça",
    text: "De perseguidor implacável dos cristãos ao maior missionário da igreja primitiva. Paulo escreveu grande parte do Novo Testamento de dentro de prisões. Sua vida prova que ninguém está longe demais do alcance do perdão e da graça transformadora de Jesus."
  }
];

const TRIVIA = [
  "A Bíblia foi escrita num período de aproximadamente 1500 anos, por cerca de 40 autores diferentes.",
  "O livro de Salmos é o maior livro da Bíblia, com 150 capítulos.",
  "Matusalém é a pessoa que viveu mais tempo na Bíblia, chegando aos 969 anos de idade (Gênesis 5:27).",
  "A palavra 'Bíblia' vem do grego 'biblos', que significa 'livros' ou 'rolo'."
];

export default function ExploreTab({ showToast }: any) {
  const [diaryText, setDiaryText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jornada_diary');
    if (saved) setDiaryText(saved);
  }, []);

  const saveDiary = () => {
    localStorage.setItem('jornada_diary', diaryText);
    setIsSaved(true);
    showToast("Diário salvo com sucesso!");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24 pt-6 px-4">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-blue-900">Explorar</h1>
        <p className="text-sm text-stone-500">Aprofunde seu conhecimento e guarde suas orações.</p>
      </div>

      {/* Diário de Oração */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <PenTool className="text-indigo-600" size={20} />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">Meu Diário de Oração</h2>
        </div>
        <Card className="p-1 border border-stone-200 bg-white">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="Escreva aqui seus pedidos de oração, gratidão ou pensamentos do dia... (Salvo apenas no seu celular)"
            className="w-full h-40 p-4 bg-transparent outline-none resize-none text-sm text-stone-700 placeholder-stone-400"
          />
          <div className="flex justify-end p-2 border-t border-stone-100">
            <button
              onClick={saveDiary}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              {isSaved ? <CheckCircle size={16} /> : <Save size={16} />}
              <span>{isSaved ? 'Salvo!' : 'Salvar Diário'}</span>
            </button>
          </div>
        </Card>
      </section>

      {/* Heróis da Fé */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <Book className="text-amber-600" size={20} />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">Heróis da Fé</h2>
        </div>
        <div className="space-y-4">
          {HEROES.map((hero, idx) => (
            <div key={idx}>
              <Card className="p-5 border border-amber-100 bg-amber-50/50">
                <h3 className="font-bold text-amber-900 text-lg">{hero.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">{hero.title}</p>
                <p className="text-sm text-stone-700 leading-relaxed">{hero.text}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Curiosidades */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <Lightbulb className="text-emerald-600" size={20} />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">Você Sabia?</h2>
        </div>
        <div className="grid gap-3">
          {TRIVIA.map((fact, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="mt-0.5">
                <CheckCircle size={16} className="text-emerald-500" />
              </div>
              <p className="text-sm text-stone-600">{fact}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
