import Document from "../models/Document.js";

export const getStats = async (req, res) => {
  try {
    const docs = await Document.find();

    const totalDocs = docs.length;

    const totalQueries = docs.reduce(
      (sum, d) => sum + (d.queryCount || 0),
      0
    );

    const totalSummaries = docs.reduce(
      (sum, d) => sum + (d.summaryCount || 0),
      0
    );

   
    const now = new Date();

    const monthlyUsage = docs.filter((d) => {
      const dDate = new Date(d.createdAt);
      return (
        dDate.getMonth() === now.getMonth() &&
        dDate.getFullYear() === now.getFullYear()
      );
    }).length;

    res.json({
      totalDocs,
      totalQueries,
      totalSummaries,
      growth: monthlyUsage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};