import express from "express";
import { saveevent, getevent, deleteevent } from "../controllers/events.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, saveevent);     // créer event
router.get("/", getevent);             // voir events
router.delete("/:id", auth, deleteevent); // supprimer si creator

export default router;
