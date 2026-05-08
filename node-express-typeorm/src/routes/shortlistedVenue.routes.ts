import { Router } from "express";
import { ShortlistedVenueController } from "../controller/ShortlistedVenueController";

const router = Router();
const shortlistedVenueController = new ShortlistedVenueController();

//get all shortlisted venues of hirer
router.get("/shortlistedVenues/:hirerID", async (req, res) => {
    await shortlistedVenueController.all(req, res);
});

//add new shortlisted venue
router.post("/shortlistedVenues/:hirerID", async (req, res) => {
    await shortlistedVenueController.save(req, res);
});

//update a shortlisted venue's rank
router.put("/shortlistedVenues/:hirerID", async (req, res) => {
    await shortlistedVenueController.update(req, res);
});

//delete shortlisted venue
router.delete("/shortlistedVenues/:hirerID", async (req, res) => {
    await shortlistedVenueController.remove(req, res);
});

export default router;
