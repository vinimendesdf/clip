import { GoogleGenAI, Type } from "@google/genai";
import { Clip } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const clipSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A catchy, scroll-stopping title (max 70 characters)."
        },
        startTime: {
            type: Type.STRING,
            description: "The suggested start time of the clip in 'MM:SS' format."
        },
        endTime: {
            type: Type.STRING,
            description: "The suggested end time of the clip in 'MM:SS' format."
        },
        summary: {
            type: Type.STRING,
            description: "A brief, one-sentence summary explaining why this clip is engaging."
        },
        viralityScore: {
            type: Type.NUMBER,
            description: "A score from 1.0 to 10.0 indicating the clip's potential to go viral."
        },
        captions: {
            type: Type.ARRAY,
            description: "An array of caption objects, timed precisely for dynamic display.",
            items: {
                type: Type.OBJECT,
                properties: {
                    startTime: {
                        type: Type.NUMBER,
                        description: "The start time for the caption line in SECONDS (e.g., 5.2)."
                    },
                    endTime: {
                        type: Type.NUMBER,
                        description: "The end time for the caption line in SECONDS (e.g., 8.7)."
                    },
                    text: {
                        type: Type.STRING,
                        description: "The text of the caption."
                    }
                },
                required: ["startTime", "endTime", "text"]
            }
        }
    },
    required: ["title", "startTime", "endTime", "summary", "viralityScore", "captions"]
};

export const generateClipsFromUrl = async (url: string): Promise<Clip[]> => {
    const prompt = `
        You are ViralClip AI, a specialized assistant for creating engaging short-form video content from long-form YouTube videos.

        Given the YouTube video URL: ${url}

        Your task is to analyze its potential content and generate 4 distinct, high-impact clips suitable for YouTube Shorts, TikTok, or Instagram Reels. Each clip must be between 30 and 60 seconds long.

        For each of the 4 clips, you must provide the following information in a structured JSON format.
        - For each caption, provide a precise start and end time in SECONDS. This is critical for creating dynamic, word-by-word style captions.

        Generate the output as a JSON array of 4 clip objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: clipSchema
                }
            }
        });
        
        const jsonText = response.text.trim();
        const clipsData = JSON.parse(jsonText);
        
        // Basic validation
        if (!Array.isArray(clipsData)) {
            throw new Error("Invalid response format from AI. Expected an array.");
        }

        return clipsData as Clip[];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI service.");
    }
};
