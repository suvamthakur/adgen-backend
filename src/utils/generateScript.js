const ai = require("../config/gemini");
const { Type } = require("@google/genai");

async function generateScript(
  noOfProducts,
  productName,
  description,
  scriptLength,
  emotion,
  scriptLanguage
) {
  const systemPrompt = `You are an AI scriptwriter specializing in creating compelling User-Generated Content (UGC) video advertisements for various products. Your primary goal is to craft professional, multi-part ad scripts based on provided specifications. Your output must be plain text, clearly dividing the script into the requested number of parts. You will receive specific parameters for each script generation request, and you must strictly adhere to the total character limit provided.`;
  const userPrompt = `
    Generate a UGC video ad script for a product. The script should maintain a professional tone and be divided into ${noOfProducts} distinct parts, suitable for sequential presentation in a video.
    Write a advertisement script for product: ${productName}.
    #Product Details: ${description}
    #Requirements:
        - Maintain a ${emotion} tone throughout the script
        - Script should be in ${scriptLanguage}
        - Focus on highlighting key benefits and unique selling points
        - Include a clear call to action
        - Ensure the script is engaging and memorable
        - Keep the character's length to approximately ${scriptLength}
        **Please write a professional, persuasive script that will resonate with the target audience.**
    #Output Format:
        - Provide the script as a single, valid JSON array. 
        - Each element in the array must be a string containing one part of the script. 
        - The number of strings (length of the array) in the array must be ${noOfProducts}. 
        - Ensure the entire output is a JSON array string and nothing else. 
        - The script content within each string should be plain text, STRICTLY with NO "Part 1:", "Part 2:", or similar prefixes or numbering.
    `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.STRING,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    console.log("GEMINI RESPONSE: ", response.text);

    if (!response || !response.text || response.text.length === 0) {
      throw new Error("Script Generation: No response from AI");
    }
    return JSON.parse(response.text);
  } catch (err) {
    console.log("ERROR: ", err);
    throw err;
  }
}

module.exports = generateScript;
