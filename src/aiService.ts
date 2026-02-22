import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In a production app, the API key should be handled securely
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getDailyVerse() {
    if (!API_KEY) {
        return '"Porque sou eu que conheço os planos que tenho para vocês", diz o Senhor, "planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro." - Jeremias 29:11';
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Escolha um versículo bíblico inspirador e curto para o dia de hoje. Retorne o texto do versículo seguido da referência (Ex: "Versículo" - Referência). Responda apenas com o versículo e a referência, sem mais nada.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro ao obter versículo:", error);
        return '"Tudo posso naquele que me fortalece." - Filipenses 4:13';
    }
}

export async function getVerseReflection(verse: string) {
    if (!API_KEY) {
        // Return a default reflection if no API key is set
        return "Reflexão: Este versículo nos lembra que o amor de Deus é a base de tudo o que fazemos. Que hoje você possa sentir esse amor em cada pequeno detalhe do seu dia.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Você é um mentor espiritual cristão sábio e acolhedor. Com base no seguinte versículo: "${verse}", escreva uma reflexão curta (máximo 3 frases) e inspiradora para o dia de hoje. Fale diretamente ao coração do leitor, oferecendo paz e propósito. Responda apenas com a reflexão, sem introduções ou comentários adicionais.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro ao gerar reflexão:", error);
        return "Não foi possível gerar uma reflexão no momento, mas saiba que a Palavra de Deus sempre tem o poder de renovar suas forças.";
    }
}
