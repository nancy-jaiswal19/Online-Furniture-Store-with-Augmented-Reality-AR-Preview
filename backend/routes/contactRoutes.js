import express from "express";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

//  USER CONTACT FORM
router.post("/", submitContact);

export default router;
