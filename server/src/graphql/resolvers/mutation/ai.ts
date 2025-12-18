import { MutationResolvers } from "../../../generated/graphql.js";

const aiResolvers: MutationResolvers = {
  generateAIContent: async (_, { prompt, context }, { user }) => {
    if (!user) throw new Error("Not Authenticated");

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("AI Service missing configuration");

    try {
      const systemContent =
        "You are a helpful writing assistant. return plain text content directly.";
      const userContent = context
        ? `${prompt}\n\nAdditional Context from document:\n${context}`
        : prompt;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemContent,
              },
              {
                role: "user",
                content: userContent,
              },
            ],
            model: "llama-3.1-8b-instant",
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API Error:", errText);
        throw new Error("Failed to generate content");
      }

      const data: any = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("AI Generation failed");
    }
  },
};

export default aiResolvers;
