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
    async getAllVenues(request: Request, response: Response) { //params are always the same here,
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
   * Creates a new venue record
   * @param req - Express request object containing venue data in body
   * @param res - Express response object
   * @returns JSON object of the created venue with 201 status
   */
    async createVenue(req: Request, res: Response) {
        /** Create a new Venue object from the request body */
        const venue = this.venueRepository.create(req.body);

        /** Save the new profile to the database */
        try {
            await this.venueRepository.save(venue);
        } catch (error) {
            return res.status(500).json({ message: "Error saving venue", error });
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
        /** Retrieve the profile from the database */
        let venue = await this.venueRepository.findOneBy({
            id: parseInt(req.params.id as string),
        });

        /** Check if the venue exists, if not, return a 404 error */
        if (!venue) {
            return res.status(404).json({ message: "Profile not found" });
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
        /** Delete the venue from the database */
        const result = await this.venueRepository.delete({
            id: parseInt(req.params.id as string),
        });

        /** Check if the profile was deleted, if not, return a 404 error */
        if (!result.affected) {
            return res.status(404).json({ message: "Venue not found" });
        }

        /** Return a 204 status on success */
        res.status(204).send();
    }


    // find venues linked to a vendor
    // look at Week 08 Example 1 - Comments Controller, Example 2 - Profile Controller
    async findByVendor(req: Request, res: Response) {
        // I think this block should work
        // const vendorID = parseInt(request.params.vendorID as string);
        // const venues = await this.venueRepository.find({
        //     where: { vendor: { id: vendorID } }
        // });
        // return response.json(venues);

        const vendor = await this.userRepository.findOneBy({
            id: parseInt(req.params.id as string),
        });

        /** Check if the Vendor exists, if not, return a 404 error */
        if (!vendor) {
            return res.status(404).json({ message: "Owner not found" });
        }

        /** Retrieve the venues from the database */
        const venues = await this.venueRepository.findOne({
            where: {
                vendor: { id: vendor.id },
            },
        });

        /** Check if venues exists, if not, return a 404 error */
        if (!venues) {
            return res.status(404).json({ message: "Venues not found" });
        }

        /** Return the pet */
        res.json(venues);
    }


}