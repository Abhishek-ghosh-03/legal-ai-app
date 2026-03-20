export const isLegalDocument = (text) => {
  const keywords = [
    "agreement",
    "contract",
    "party",
    "clause",
    "liability",
    "jurisdiction",
    "terms",
    "conditions",
    "indemnity",
    "governing law"
  ];

  const lowerText = text.toLowerCase();

  let matchCount = 0;

  keywords.forEach((word) => {
    if (lowerText.includes(word)) matchCount++;
  });

  
  return matchCount >= 1;
};