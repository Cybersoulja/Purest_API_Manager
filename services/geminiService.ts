
import { GoogleGenAI, Type } from "@google/genai";
import { PurestConfig } from "../types";

// Always use process.env.API_KEY directly as per @google/genai coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PUREST_SYSTEM_INSTRUCTION = `
You are a world-class expert in the "Purest" REST API abstraction library and the Google API Python Client (google-api-python-client).
Your goal is to help users generate highly expressive and functional API client configurations.

Purest Core Concepts:
1. "origin": The protocol and domain.
2. "path": The path part of the URL, uses tokens like {path}, {version}, {type}.
3. "headers": Default headers for the provider.
4. "defaults": Preconfigured values for methods (e.g., auth tokens).
5. "method aliases": Custom names for HTTP methods (e.g., "select" for "get").

Google API Python Client (google-api-python-client) Concepts (for Google APIs):
1. Use googleapiclient.discovery.build(serviceName, version, ...) to create a service client.
2. Authentication options: API key (public data), OAuth 2.0 Credentials, or service_account.Credentials.
3. Each Google API has a unique serviceName (e.g., "youtube", "drive", "gmail", "sheets").
4. Requests are chained resource methods, e.g. service.videos().list(part="snippet").execute().
5. Install with: pip install google-api-python-client google-auth google-auth-httplib2.

When a user asks for an API (e.g., "Stripe", "GitHub", "YouTube"), you should provide a valid Purest JSON configuration and a code snippet showing how to use it.
When the user asks for a Google API (e.g., "YouTube", "Drive", "Gmail", "Sheets"), also mention the google-api-python-client approach in your explanation.

Always return valid JSON for the configuration part.
`;

export async function generatePurestConfig(prompt: string): Promise<{ config: PurestConfig; explanation: string }> {
  // Use gemini-3-pro-preview for complex reasoning and coding tasks like generating API configurations.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: PUREST_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          config: {
            type: Type.OBJECT,
            description: "The Purest JSON configuration object"
          },
          explanation: {
            type: Type.STRING,
            description: "An explanation of how to use this configuration with purest"
          }
        },
        required: ["config", "explanation"]
      }
    }
  });

  try {
    // Accessing .text property directly as per @google/genai coding guidelines.
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return { config: {}, explanation: "Error parsing the response." };
  }
}
