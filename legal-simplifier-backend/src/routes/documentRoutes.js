import express from "express";
import { upload } from "../middleware/upload.js";
import {
  uploadDocument,
  getSummary,
  getClauses,
  askQuestion,
  downloadDocument 
} from "../controllers/documentController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getAllDocuments } from "../controllers/documentController.js";
import { downloadSummaryPDF } from "../controllers/documentController.js";

const router = express.Router();


router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);


router.get("/:id/summary", authMiddleware, getSummary);


router.get("/:id/clauses", authMiddleware, getClauses);


router.post("/:id/query", authMiddleware, askQuestion);


router.get("/:id/download", authMiddleware, downloadDocument);
router.get("/:id/download-summary", authMiddleware, downloadSummaryPDF);

router.get("/", authMiddleware, getAllDocuments);
export default router;