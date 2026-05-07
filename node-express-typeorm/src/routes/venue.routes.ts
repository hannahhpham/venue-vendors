import { Router } from "express";
import { VenueController } from "../controller/VenueController";

// ADAPTED FROM Week 9 Lecture Example 1 - profile.routes.ts

const router = Router();

const venueController = new VenueController();

router.get("/venues", async (req, res) => {
    await venueController.getAllVenues(req, res);
});

router.get("/venues/:id", async (req, res) => {
    await venueController.getOneVenue(req, res);
});

router.post("/venues", async (req, res) => {
    await venueController.createVenue(req, res);
});

router.put("/venues/:id", async (req, res) => {
    await venueController.updateVenue(req, res);
});

router.delete("/venues/:id", async (req, res) => {
    await venueController.deleteVenue(req, res);
});

// CHECK THIS - again not sure whether this would be best
//  to have linked to user rather than venue
router.get("/:id/user", (req, res) => venueController.findByVendor(req, res));

export default router;