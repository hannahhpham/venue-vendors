import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";

// ADAPTED FROM Week 9 Lecture Example 1 - profile.routes.ts

const router = Router();

const appController = new ApplicationController();

router.get("/", async (req, res) => {
    await appController.getAllApps(req, res);
});

router.get("/venues/:venueID", async (req, res) => {
    await appController.allByVenue(req, res);
});

router.get("/hirers/:hirerID", async (req, res) => {
    await appController.allByHirer(req, res);
});

router.get("/hirers/past/:hirerID", async (req, res) => {
    await appController.allPastByHirer(req, res);
});

router.get("/:appID", async (req, res) => {
    await appController.getOneApp(req, res);
});

router.post("/", async (req, res) => {
    await appController.createApp(req, res);
});

router.put("/:id", async (req, res) => {
    await appController.updateApp(req, res);
});

router.delete("/:id", async (req, res) => {
    await appController.deleteApp(req, res);
});


export default router;