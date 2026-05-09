import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";
import { User } from "../entities/User";
import { Application } from "../entities/Application";

// using Lecture 9 Example 1

export class ApplicationController {

    private venueRepository = AppDataSource.getRepository(Venue);

    private userRepository = AppDataSource.getRepository(User);

    private applicationRepository = AppDataSource.getRepository(Application);

    /**
     * Retrieves all applications from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all applications
     */
    async getAllApps(request: Request, response: Response) {
        const apps = await this.applicationRepository.find();
        return response.json(apps);
    }


    /**
     * Retrieves all applications for a venue
     * @param request - Express request object containing the venueID in the params
     * @param response - Express response object
     * @returns JSON response containing an array of all applications
     */
    async allByVenue(request: Request, response: Response) {
        const venueID = parseInt(request.params.venueID as string);
        const venue = await this.venueRepository.findOne({
            where: {id: venueID },
        })

        if (!venue) {
            return response.status(404).json({ message: "Venue could not be found" });
        }

        const apps = await this.applicationRepository.find({
            where: { venue: {id : venue.id } },
        });
        return response.json(apps);
    }


    /**
     * Retrieves all applications for a hirer
     * @param request - Express request object containing the hirerID in the params
     * @param response - Express response object
     * @returns JSON response containing an array of all applications
     */
    async allByHirer(request: Request, response: Response) {
        const hirerID = parseInt(request.params.hirerID as string);
        const hirer = await this.userRepository.findOne({
            where: {id: hirerID },
        })

        if (!hirer) {
            return response.status(404).json({ message: "Hirer could not be found" });
        }

        const apps = await this.applicationRepository.find({
            where: { user: { id: hirer.id } },
        });
        return response.json(apps);
    }


    /**
     * Retrieves a single application by its ID
     * @param request - Express request object containing the application ID in params
     * @param response - Express response object
     * @returns JSON response containing the application if found, or 404 error if not found
     */
    async getOneApp(request: Request, response: Response) {
        const id = parseInt(request.params.appID as string);
        const app = await this.applicationRepository.findOne({
            where: { id },
        });
        if (!app) {
            return response.status(404).json({ message: "Application not found" });
        }
        return response.json(app);
    }

    /**
     * Creates a new application record
     * @param req - Express request object containing application data in body
     * @param res - Express response object
     * @returns JSON object of the created application with 201 status
     */
    async createApp(req: Request, res: Response) {
        /** Create a new Application object from the request body */
        const app = this.applicationRepository.create(req.body);

        /** Save the new application to the database */
        try {
            await this.applicationRepository.save(app);
        } catch (error) {
            return res.status(500).json({ message: "Error saving application", error });
        }

        /** Return the created application with a 201 status */
        res.status(201).json(app);
    }



    // STILL NEED TO FIX THIS (POSSIBLY)
    /**
     * Updates an application record
     * @param req - Express request object containing applicationID in params and update data in body
     * @param res - Express response object
     * @returns JSON object of the updated application or 404 if not found
     */
    async updateApp(req: Request, res: Response) {
        /** Retrieve the application from the database */
        let app = await this.applicationRepository.findOneBy({
            id: parseInt(req.params.id as string),
        });

        /** Check if the application exists, if not, return a 404 error */
        if (!app) {
            return res.status(404).json({ message: "Profile not found" });
        }

        /** Merge the existing application with the new data from the request body */
        this.applicationRepository.merge(app, req.body);

        /** Save the updated venue to the database */
        try {
            await this.applicationRepository.save(app);
        } catch (error) {
            return res.status(500).json({ message: "Error saving venue", error });
        }

        /** Return the updated venue */
        res.json(app);
    }


    /**
     * Deletes a application record
     * @param req - Express request object containing applicationID in params
     * @param res - Express response object
     * @returns 204 status on success or 404 if application not found
     */
    async deleteApp(req: Request, res: Response) {
        /** Delete the venue from the database */
        const result = await this.applicationRepository.delete({
            id: parseInt(req.params.id as string),
        });

        /** Check if the profile was deleted, if not, return a 404 error */
        if (!result.affected) {
            return res.status(404).json({ message: "Application not found" });
        }

        /** Return a 204 status on success */
        res.status(204).send();
    }

}