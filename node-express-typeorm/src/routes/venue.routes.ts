import { Router } from "express";
import { VenueController } from "../controller/VenueController";

//backend validation
import {createVenueDTO} from '../dtos/create-venue.dto'
import { validateDto } from "../middlewares/validate";
import {updateVenueDTO} from '../dtos/update-venue.dto'

// ADAPTED FROM Week 9 Lecture Example 1 - profile.routes.ts

const router = Router();

const venueController = new VenueController();

router.get("/", async (req, res) => {
    await venueController.getAllVenues(req, res);
});

router.get("/:id", async (req, res) => {
    await venueController.getOneVenue(req, res);
});

router.get("/users/:vendorID", async (req, res) => {
    await venueController.getByVendor(req, res);
});

router.post("/", validateDto(createVenueDTO), async (req, res) => {
    await venueController.createVenue(req, res);
});

router.put("/:venueID", validateDto(updateVenueDTO) , async (req, res) => {
    await venueController.updateVenue(req, res);
});

router.delete("/:venueID", async (req, res) => {
    await venueController.deleteVenue(req, res);
});

export default router;