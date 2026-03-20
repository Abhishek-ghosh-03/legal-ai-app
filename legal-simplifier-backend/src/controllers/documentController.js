import fs from "fs";
import path from "path";

import { extractTextFromPDF } from "../services/pdfService.js";
import Document from "../models/Document.js";
import {
  generateSummary,
  generateClauses,
  getEmbedding,
  generateAnswer,
} from "../services/llmService.js";
import { chunkText } from "../utils/chunkText.js";
import { findRelevantChunks } from "../utils/similarity.js";
import { redis } from "../utils/redisClient.js";
import PDFDocument from "pdfkit";
import { isLegalDocument } from "../utils/legalValidator.js";


export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }


    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    const fileName = Date.now() + "-" + file.originalname;
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, file.buffer);


    let text = "";

    try {
      text = await extractTextFromPDF(file.buffer);
    } catch (err) {
      console.error("PDF ERROR:", err);
      return res.status(500).json({ error: "PDF parsing failed" });
    }

    const limitedText = text.substring(0, 8000);
    const isLegal = isLegalDocument(text);
    const chunks = chunkText(limitedText).slice(0, 10);

    const embeddedChunks = [];

    for (let chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk);

        embeddedChunks.push({
          text: chunk,
          embedding,
        });
      } catch (err) {
        console.log("Embedding skipped:", err.message);
      }
    }
    const doc = await Document.create({
      name: file.originalname,
      text: limitedText,
      chunks: embeddedChunks,
      fileUrl: filePath,
      isLegal
    });

    res.json({
      message: "Uploaded successfully",
      id: doc._id,
    });

  } catch (err) {
    console.error("UPLOAD ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
};


export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc || !doc.fileUrl) {
      return res.status(404).json({ error: "File not found" });
    }

    const absolutePath = path.resolve(doc.fileUrl);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File missing on server" });
    }

    res.download(absolutePath);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `summary:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ summary: cached });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    if (!doc.isLegal) {
      return res.json({
        summary: "⚠️ This document does not appear to be a legal document. Summary may not be accurate."
      });
    }

    const summary = await generateSummary(doc.text);

    await redis.set(cacheKey, summary, "EX", 3600);

    doc.summaryCount = (doc.summaryCount || 0) + 1;
    await doc.save();

    res.json({ summary });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getClauses = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `clauses:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ clauses: JSON.parse(cached) });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    if (!doc.isLegal) {
      return res.json({
        clauses: [
          {
            title: "Not a legal document",
            meaning: "This file does not contain structured legal clauses."
          }
        ]
      });
    }

    const raw = await generateClauses(doc.text);

    const jsonMatch = raw.match(/\[\s*{[\s\S]*}\s*\]/);

    if (!jsonMatch) {
      console.error("INVALID CLAUSE OUTPUT:", raw);
      return res.status(500).json({ error: "Invalid clause format" });
    }

    let cleaned = jsonMatch[0]
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/\n/g, " ")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR:", cleaned);
      return res.status(500).json({ error: "Clause parsing failed" });
    }

    await redis.set(cacheKey, JSON.stringify(parsed), "EX", 3600);

    res.json({ clauses: parsed });

  } catch (err) {
    console.error("CLAUSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const askQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const cacheKey = `query:${id}:${question}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ answer: cached });
    }

    const doc = await Document.findById(id);

    if (!doc || !doc.chunks) {
      return res.status(404).json({ error: "Document not found" });
    }
    if (!doc.isLegal) {
      return res.json({
        answer: "This document is not recognized as a legal document. Answers may not be reliable."
      });
    }

    const queryEmbedding = await getEmbedding(question);

    const relevantChunks = findRelevantChunks(
      queryEmbedding,
      doc.chunks
    );

    const context = relevantChunks.join("\n");

    const answer = await generateAnswer(context, question);

    await redis.set(cacheKey, answer, "EX", 3600);
    doc.queryCount = (doc.queryCount || 0) + 1;
    await doc.save();
    res.json({ answer });
    const forbidden = ["hack", "bypass", "illegal", "exploit"];

    if (forbidden.some((word) => question.toLowerCase().includes(word))) {
      return res.status(400).json({
        error: "Invalid or unsafe query"
      });
    }

  } catch (err) {
    console.error("Q&A ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });

    res.json({ docs });
  } catch (err) {
    console.error("GET DOCS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadSummaryPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const docData = await Document.findById(id);

    if (!docData) {
      return res.status(404).json({ error: "Document not found" });
    }


    const summary = await generateSummary(docData.text);


    const pdf = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=summary-${id}.pdf`
    );

    pdf.pipe(res);


    pdf.fontSize(18).text("Document Summary", { align: "center" });
    pdf.moveDown();

    pdf.fontSize(12).text(summary, {
      align: "left",
      lineGap: 4,
    });

    pdf.end();

  } catch (err) {
    console.error("SUMMARY PDF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};