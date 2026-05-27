import express from "express";
import {
  runWorkflow,
  executeWorkflow,
} from "../controllers/workflowController.js";

const router = express.Router();

router.post("/run", runWorkflow);
router.post("/execute", executeWorkflow);

export default router;
