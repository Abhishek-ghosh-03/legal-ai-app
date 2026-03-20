import cosineSimilarity from "cosine-similarity";

export const findRelevantChunks = (queryEmbedding, chunks, topK = 3) => {
  const scored = chunks.map((chunk) => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map((c) => c.text);
};