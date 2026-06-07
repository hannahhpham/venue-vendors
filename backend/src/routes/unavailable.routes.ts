import { Router } from "express";
import { UnavailableController } from "../controller/UnavailableController";

import {createBlockDTO} from '../dtos/create-block.dto'
import { validateDto } from "../middlewares/validate";

// ADAPTED FROM Week 9 Lecture Example 1 - profile.routes.ts

const router = Router();

const blockedController = new UnavailableController();

router.get("/", async (req, res) => {
    await blockedController.getAllBlocked(req, res);
});

router.get("/venues/:venueID", async (req, res) => {
    await blockedController.allByVenue(req, res);
});

router.get("/:blockedID", async (req, res) => {
    await blockedController.getOneBlocked(req, res);
});

//cant get this one working
//validateDto(createBlockDTO)
router.post("/", async (req, res) => {
    await blockedController.block(req, res);
});

router.put("/:id", async (req, res) => {
    await blockedController.update(req, res);
});

router.delete("/:id", async (req, res) => {
    await blockedController.unblock(req, res);
});


export default router;