require('dotenv').config(); // Load .env at the top

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Correctly read from .env
});

const openai = new OpenAIApi(configuration);

async function predictDomain(paperTitle, abstract) {
  const prompt = `
Given the following research paper title and abstract, identify the most relevant domain from the following options:
- Artificial Intelligence
- Machine Learning
- Cybersecurity
- Data Science
- Cloud Computing
- Internet of Things
- Software Engineering
- Computer Networks
- Blockchain
- Human-Computer Interaction

Title: ${paperTitle}
Abstract: ${abstract}

Return only the domain name without explanation.
`;

  let retries = 3;
  while (retries--) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const predictedDomain = completion.data.choices[0].message.content.trim();
      return predictedDomain;
    } catch (error) {
      if (error.response?.status === 429 && retries > 0) {
        console.warn("Rate limited by OpenAI. Retrying in 3 seconds...");
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        console.error("OpenAI Error:", error.response?.data || error.message);
        break;
      }
    }
  }

  return "Unknown"; // Fallback if all retries fail
}

module.exports = { predictDomain };
