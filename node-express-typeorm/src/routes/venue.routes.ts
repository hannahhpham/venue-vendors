import { Router } from "express";
import { VenueController } from "../controller/VenueController";

// ADAPTED FROM Week 9 Lecture Example 1 - profile.routes.ts

const router = Router();

const venueController = new VenueController();

router.get("/users", async (req, res) => {
    await venueController.getAllVenues(req, res);
});

router.get("/users/:id", async (req, res) => {
    await venueController.getOneVenue(req, res);
});

router.post("/users", async (req, res) => {
    await venueController.createVenue(req, res);
});

router.put("/users/:id", async (req, res) => {
    await venueController.updateVenue(req, res);
});

router.delete("/users/:id", async (req, res) => {
    await venueController.deleteVenue(req, res);
});

// CHECK THIS - again not sure whether this would be best
//  to have linked to user rather than venue
router.get("/:id/user", (req, res) => venueController.findByVendor(req, res));

export default router;