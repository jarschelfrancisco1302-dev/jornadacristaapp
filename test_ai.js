import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testAI() {
    console.log("Testing API Key:", API_KEY ? "Present" : "Missing");
    const models = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Diga 'Olá' em português.");
            const response = await result.response;
            console.log(`Success with ${modelName}:`, response.text());
            break;
        } catch (error) {
            console.error(`Failed with ${modelName}:`, error.message || error);
            // Check for 404 specifically
            if (error.status === 404) {
                console.log(`Model ${modelName} not found (404).`);
            }
        }
    }
}

testAI();
