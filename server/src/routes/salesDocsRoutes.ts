import { Router } from "express";
import {
  getSalesDocuments,
  uploadSalesDocument,
  addSalesDocument,
  updateSalesDocument,
  deleteSalesDocument,
} from "../controllers/salesDocsController";

const router = Router();

router.get("/sales-documents", getSalesDocuments);
router.post("/sales-documents/upload", uploadSalesDocument);
router.post("/sales-documents", addSalesDocument);
router.put("/sales-documents/:id", updateSalesDocument);
router.delete("/sales-documents/:id", deleteSalesDocument);

export default router;
