import axios from "axios";

export const generateSummary = async (text) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct", 
        messages: [
          {
            role: "user",
            content: `
            You are a legal assistant specialized in Indian law.
Only respond if the document is legal in nature.
Otherwise clearly state that the document is not legal.
Summarize the following legal document in simple terms.
Focus on:
- Rights and obligations
- Key clauses
- Legal implications under Indian law

Do NOT provide generic summaries. Be specific to Indian legal context.

Document:
TEXT:
${text.substring(0, 3000)}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("LLM Error:", err.response?.data || err.message);
    throw new Error("Failed to generate summary");
  }
};

export const generateClauses = async (text) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: `
Return ONLY valid JSON.

Format:
[
  {
    "title": "string",
    "meaning": "string",
    "risk": "Low | Medium | High"
  }
]
You are a legal expert specializing in Indian law.

Extract key clauses from the document and explain them in simple terms.

Rules:
- Interpret clauses under Indian legal framework
- Highlight risks if any
- Use simple language

Return ONLY JSON array:
[
  { "title": "...", "meaning": "..." }
]

valid JSON (no trailing commas)
Document:

TEXT:
${text.substring(0, 3000)}
`
            ,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("Clause Error:", err.response?.data || err.message);
    throw new Error("Failed to generate clauses");
  }
};

export const getEmbedding = async (text) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/embeddings",
    {
      model: "sentence-transformers/all-MiniLM-L6-v2",
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    }
  );

  return response.data.data[0].embedding;
};

export const generateAnswer = async (context, question) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "user",
          content: `
You are a legal AI assistant specialized in Indian law.

Answer the question strictly based on:
1. The provided document context
2. Indian legal principles

Rules:
- Do NOT hallucinate
- If unsure → say "Not clearly specified in the document"
- Keep answers concise
- Mention legal implications where relevant

Context:
${context}

Question:
${question}
            `,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};