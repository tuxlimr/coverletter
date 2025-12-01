

import { GoogleGenAI, Content } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCoverLetter = async (
  cvText: string, 
  jobDescription: string, 
  tone: string,
  cvFile?: { data: string; mimeType: string },
  minWords?: number
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the length instruction
    const lengthInstruction = minWords 
      ? `- Ensure the letter is at least ${minWords} words long. You must expand on the candidate's skills and experiences in detail to meet this length requirement without being repetitive.` 
      : '- Keep under 400 words.';

    // Base prompt text
    let promptText = `
      You are an expert career coach. Write a compelling, ATS-friendly cover letter (3-4 paragraphs) for this candidate applying to this exact job.

      Job Description:
      ${jobDescription}

      Requirements:
      - Match bullet points and keywords from the job description exactly where possible based on the provided CV.
      - Use confident but natural language.
      - Tone: ${tone}
      - Never hallucinate experience; strictly use the CV provided.
      ${lengthInstruction}
      - Do not include placeholders like [Your Name] or [Date] at the top, just start with "Dear Hiring Team," or "Dear [Company Name] Team,".
    `;

    const parts: any[] = [];

    // If file exists, add it as inlineData
    if (cvFile) {
      parts.push({
        inlineData: {
          mimeType: cvFile.mimeType,
          data: cvFile.data
        }
      });
      promptText += `\n\nRefer to the attached CV document for the candidate's experience.`;
    } else {
      // Otherwise use the text input
      promptText += `\n\nCandidate's Experience (from CV):\n${cvText}`;
    }

    // Add the prompt text as the final part
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
    });

    return response.text || "I couldn't generate the letter. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to connect to the AI service. Please check your API key and ensure the file type is supported.");
  }
};

export const generateTextResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history as Content[],
      config: {
        systemInstruction: "You are Aura, a helpful and creative AI assistant.",
      }
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I apologize, but I encountered an error processing your request.";
  }
};

export const generateImageResponse = async (prompt: string): Promise<{ imageUrl?: string; error?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const imageUrl = `data:image/png;base64,${base64EncodeString}`;
        return { imageUrl };
      }
    }
    return { error: "No image generated." };
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return { error: "Image generation failed." };
  }
};

export const summarizeJournal = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this journal entry and provide 3-5 short, relevant tags (comma separated, no hashtags). Entry: ${text}`,
    });
    return response.text || "Journal, Entry";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Journal";
  }
};