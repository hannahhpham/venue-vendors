import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";
import { Unavailable } from "../entities/Unavailable";

// using Lecture 9 Example 1

export class UnavailableController {

    private blockedRepository = AppDataSource.getRepository(Unavailable);

    private venueRepository = AppDataSource.getRepository(Venue);

    /**
     * THIS ONES KINDA USELESS NGL
     * Retrieves all blocked times from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all applications
     */
    async getAllBlocked(request: Request, response: Response) {
        const blocked = await this.blockedRepository.find();
        return response.json(blocked);
    }


    /**
     * Retrieves all blocked for a venue
     * @param request - Express request object containing the venueID in the params
     * @param response - Express response object
     * @returns JSON response containing an array of all blocked periods
     */
    async allByVenue(request: Request, response: Response) {
        const venueID = parseInt(request.params.venueID as string);
        const venue = await this.venueRepository.findOne({
            where: {id: venueID },
        })

        if (!venue) {
            return response.status(404).json({ message: "Venue could not be found" });
        }

        const blocked = await this.blockedRepository.find({
            where: { venue: {id : venue.id } },
        });
        return response.json(blocked);
    }


    /**
     * Retrieves a single blocked period by its ID
     * @param request - Express request object containing the blockedID in params
     * @param response - Express response object
     * @returns JSON response containing the blocked period if found, or 404 error if not found
     */
    async getOneBlocked(request: Request, response: Response) {
        const id = parseInt(request.params.blockedID as string);
        const blocked = await this.blockedRepository.findOne({
            where: { id },
        });
        if (!blocked) {
            return response.status(404).json({ message: "Blocked period not found" });
        }
        return response.json(blocked);
    }


    /**
     * Creates a new unavailable record
     * @param req - Express request object containing unavailable data in body
     * @param res - Express response object
     * @returns JSON object of the created a new blocked period with 201 status
     */
    async block(req: Request, res: Response) {
        /** Create a new Unavailable object from the request body */
        const blocked = this.blockedRepository.create(req.body);
        // const { startTime, endTime, date, venueID } =  req.body;

        // const blocked = Object.assign(new Unavailable(), {
        //     startTime: startTime,
        //     endTime: endTime,
        //     date: date,
        //     venueID: venueID
        // });
        
        // const data = this.blockedRepository.create(blocked);

        /** Save the new blocked period to the database */
        try {
            await this.blockedRepository.save(blocked);
        } catch (error) {
            return res.status(500).json({ message: "Error saving blocked period: ", error });
        }

        /** Return the created period with a 201 status */
        res.status(201).json(blocked);
    }



    /**
     * Updates a blocked record
     * @param req - Express request object containing blockedID in params and update data in body
     * @param res - Express response object
     * @returns JSON object of the updated period or 404 if not found
     */
    async update(req: Request, res: Response) {
        /** Retrieve the period from the database */
        let blocked = await this.blockedRepository.findOneBy({
            id: parseInt(req.params.id as string),
        });

        /** Check if the period exists, if not, return a 404 error */
        if (!blocked) {
            return res.status(404).json({ message: "Blocked period not found" });
        }

        /** Merge the existing period with the new data from the request body */
        this.blockedRepository.merge(blocked, req.body);

        /** Save the updated period to the database */
        try {
            await this.blockedRepository.save(blocked);
        } catch (error) {
            return res.status(500).json({ message: "Error saving the updated blocked period", error });
        }

        /** Return the updated period */
        res.json(blocked);
    }


    /**
     * Deletes a blocked record
     * @param req - Express request object containing blockedID in params
     * @param res - Express response object
     * @returns 204 status on success or 404 if period not found
     */
    async unblock(req: Request, res: Response) {
        /** Delete the period from the database */
        const result = await this.blockedRepository.delete({
            id: parseInt(req.params.id as string),
        });

        /** Check if the period was deleted, if not, return a 404 error */
        if (!result.affected) {
            return res.status(404).json({ message: "Blocked period not found" });
        }

        /** Return a 204 status on success */
        res.status(204).send();
    }

}