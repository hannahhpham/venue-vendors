import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";
import { User } from "../entities/User";

// using Lecture 9 Example 1

export class VenueController {

    private venueRepository = AppDataSource.getRepository(Venue);

    private userRepository = AppDataSource.getRepository(User);

    /**
     * Retrieves all venues from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all venues
     */
    async getAllVenues(request: Request, response: Response) {
        const venues = await this.venueRepository.find();
        return response.json(venues);
    }


    /**
     * Retrieves a single venue by its ID
     * @param request - Express request object containing the venue ID in params
     * @param response - Express response object
     * @returns JSON response containing the venue if found, or 404 error if not found
     */
    async getOneVenue(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const venue = await this.venueRepository.findOne({
            where: { id },
        });
        if (!venue) {
            return response.status(404).json({ message: "Venue not found" });
        }
        return response.json(venue);
    }


    /**
     * Get the venues associated with a Vendor
     * @param req - Express request object containing user id in params
     * @param res - Express response object
     * @returns the list of venues associated with a vendor
     */
    async getByVendor(req: Request, res: Response) {
        
        const vendorID = parseInt(req.params.vendorID as string);

        const vendor = await this.userRepository.findOne({
            where: { id: vendorID },
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor could not be found." });
        }

        const myVenues = await this.venueRepository.find({
            where: {vendor : {id : vendorID} },
        });

        if (!myVenues) {
            return res.status(404).json({ message: "Vendor has no shortlisted venues." });
        }
        
        return res.json(myVenues);
    }


    /**
     * Creates a new venue record
     * @param req - Express request object containing venue data in body
     * @param res - Express response object
     * @returns JSON object of the created venue with 201 status
     */
    async createVenue(req: Request, res: Response) {
        /** Create a new Venue object from the request body */
        const venue = this.venueRepository.create(req.body);

        /** Save the new venue to the database */
        try {
            await this.venueRepository.save(venue);
        } catch (error) {
            return res.status(500).json({ message: "Error creating venue", error });
        }

        /** Return the created venue with a 201 status */
        res.status(201).json(venue);
    }


    /**
     * Updates a venue record
     * @param req - Express request object containing venueID in params and update data in body
     * @param res - Express response object
     * @returns JSON object of the updated venue or 404 if not found
     */
    async updateVenue(req: Request, res: Response) {
        /** Retrieve the venue from the database */
        const id: number = parseInt(req.params.venueID as string);
        
        let venue = await this.venueRepository.findOne({
            where : {id : id},
        });

        /** Check if the venue exists, if not, return a 404 error */
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        /** Merge the existing venue with the new data from the request body */
        this.venueRepository.merge(venue, req.body);

        /** Save the updated venue to the database */
        try {
            await this.venueRepository.save(venue);
        } catch (error) {
            return res.status(500).json({ message: "Error saving venue", error });
        }

        /** Return the updated venue */
        res.json(venue);
    }


    /**
     * Deletes a venue record
     * @param req - Express request object containing venueID in params
     * @param res - Express response object
     * @returns 204 status on success or 404 if venue not found
     */
    async deleteVenue(req: Request, res: Response) {

        const id = parseInt(req.params.venueID as string);

        /** Delete the venue from the database */
        const result = await this.venueRepository.delete({
            id: id,
        });

        /** Check if the profile was deleted, if not, return a 404 error */
        if (!result.affected) {
            return res.status(404).json({ message: "Venue not found" });
        }

        /** Return a 204 status on success */
        res.status(204).send();
    }

}