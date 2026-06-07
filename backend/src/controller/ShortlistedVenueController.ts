import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import {ShortlistedVenue} from '../entities/ShortlistedVenue'

// this page has been copied from week 8's lab 'UserController.ts'
// with modifications

export class ShortlistedVenueController {
    private shortlistRepository = AppDataSource.getRepository(ShortlistedVenue);

    /**
     * Retrieves all shortlistedVenues belonging to a hirer from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all shortlisted venues from the specific hirer
     */
    async all(request: Request, response: Response) {
        const hirerID = parseInt(request.params.hirerID as string);
        const shortlistedVenues = await this.shortlistRepository.find({
            where: {hirerID},
        });
        if (!shortlistedVenues) {
            return response.status(404).json({ message: "Hirer has no shortlisted venues." });
        }
        return response.json(shortlistedVenues);
    }

    /**
     * Retrieves one shortlistedVenues belonging to a hirer by it's rank
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all shortlisted venues from the specific hirer
     */
    async one(request: Request, response: Response) {
        const hirerID = parseInt(request.params.hirerID as string);
        const rank = parseInt(request.params.rank as string);

        // console.log("rank is ", rank, " hirer is ", hirerID);
        const shortlistedVenue = await this.shortlistRepository.findOne({
            where: {hirerID, rank},
        });
        // console.log("found venue ", shortlistedVenue, " in controller");
        if (!shortlistedVenue) {
            return response.status(404).json({ message: "Hirer has no shortlisted venue with this rank." });
        }
        return response.json(shortlistedVenue);
    }

    /**
     * saves a new shortlisted venue after checks
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing the shortlistedVenue
     */
    async save(request: Request, response: Response) {
        //get hirerID from url params instead
        const { hirerID, venueID, rank } = request.body;

        console.log("hirerID is ", hirerID);

        const shortlistedVenue = Object.assign(new ShortlistedVenue(), {
            hirerID,
            venueID,
            rank,
        });
        try {
            const savedShortlistedVenue = await this.shortlistRepository.save(shortlistedVenue);
            return response.status(201).json(savedShortlistedVenue);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error shortlisting the venue", error });
        }
    }


    /**
     * removes a shortlisted venue from the hirer's list
     * @param request - Express request object containing the shortlistedVenue ID in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 error if venue not found
     */
    async remove(request: Request, response: Response) {
        const venueID = parseInt(request.body.venueID as string);
        const hirerID = parseInt(request.params.hirerID as string);
        const venueToRemove = await this.shortlistRepository.findOne({
            where: {venueID },
        });

        // console.log("venue id we want to remove is ", venueID);
        // console.log("found venue to remove is ", venueToRemove);
        if (!venueToRemove) {
            return response.status(404).json({ message: "Venue to remove not found" });
        }
        await this.shortlistRepository.remove(venueToRemove);
        return response.json({ message: "Venue removed from shortlist successfully" });
    }

    /**
     * changes the rank of the shortlisted venue
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing the shortlisted venue
     */
    async update(request: Request, response: Response) {
        //const venueID = parseInt(request.params.venueID as string);
        const { hirerID, venueID, rank } = request.body;

        console.log("hirer: ", hirerID, " | venue: ", venueID, " | updated rank: ", rank);
        let venueToUpdate = await this.shortlistRepository.findOne({ //find the hirer's venue
            where: { hirerID, venueID },
        });
        if (!venueToUpdate) {
            return response.status(404).json({ message: "Shortlisted venue not found" });
        }
        venueToUpdate = Object.assign(venueToUpdate, { //may need to change this to have all user details
            hirerID,
            venueID,
            rank
        });
        try {
            const updatedVenue = await this.shortlistRepository.save(venueToUpdate);
            return response.json(updatedVenue);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating the shortlisted venue", error });
        }
    }
}
