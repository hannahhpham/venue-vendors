import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as argon2 from 'argon2';

// this ENTIRE page has been copied from week 8's lab 'UserController.ts'
// with minor modifications

//crypto-js (based on javascript, not sure if we can use it here) IS AN ALTERNATIVE FOR HASHING SHA256

//TODO:
// need to change ALL methods to accept the relevant user data
 
export class UserController {
    private userRepository = AppDataSource.getRepository(User);
    
    /**
     * Retrieves all users from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all users
     */
    async all(request: Request, response: Response) { //params are always the same here,
        const users = await this.userRepository.find();
        return response.json(users);
    }

    /**
     * Retrieves a single user by their ID
     * @param request - Express request object containing the user ID in params
     * @param response - Express response object
     * @returns JSON response containing the user if found, or 404 error if not found
     */
    async oneById(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        return response.json(user);
    }

    /**
     * Retrieves a single user by their email
     * @param request - Express request object containing the user email in params
     * @param response - Express response object
     * @returns JSON response containing the user if found, or 404 error if not found
     */
    async oneByEmail(request: Request, response: Response) {
        const email = request.params.email as string;
        const {password} = request.query; //get the password the user entered

        const user = await this.userRepository.findOne({
            where: {email},
        });



        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        try {
            if (await argon2.verify(user.password, String(password))) {
                return response.json(user);
            }
            else { //password doesn't match
                return response.status(404).json({ message: "Password does not match" });
            }
        }
        catch (err) {
            return response.status(404).json({ message: "Internal error" });
        }
        
        
    }

    // TODO: UPDATE THIS
    /**
     * Creates a new user in the database
     * @param request - Express request object containing user details in body
     * @param response - Express response object
     * @returns JSON response containing the created user or error message
     */
    async save(request: Request, response: Response) {
        const { email, password, type, firstName, lastName, phoneNumber } = request.body;

        const hash = await argon2.hash(password);

        const user = Object.assign(new User(), {
            email,
            password: hash,
            type,
            firstName, 
            lastName,
            phoneNumber
        });

        try {
            const savedUser = await this.userRepository.save(user);
            return response.status(201).json(savedUser);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error creating user", error });
        }
    }
    

    /** do we even need this...no right...
     * Deletes a user from the database by their ID
     * @param request - Express request object containing the user ID in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 error if user not found
     */
    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const userToRemove = await this.userRepository.findOne({
            where: { id },
        });
        if (!userToRemove) {
            return response.status(404).json({ message: "User not found" });
        }
        await this.userRepository.remove(userToRemove);
        return response.json({ message: "User removed successfully" });
    }

    /**
     * Updates an existing user's information
     * @param request - Express request object containing user ID in params and updated details in body
     * @param response - Express response object
     * @returns JSON response containing the updated user or error message
     */
    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { firstName, lastName, phoneNumber, drivLic, insur, credibility, reputation } = request.body;
        let userToUpdate = await this.userRepository.findOne({
            where: { id },
        });
        if (!userToUpdate) {
            return response.status(404).json({ message: "User not found" });
        }
        userToUpdate = Object.assign(userToUpdate, { //may need to change this to have all user details
            firstName,
            lastName,
            phoneNumber,
            drivLic,
            insur,
            credibility,
            reputation
        });
        try {
            const updatedUser = await this.userRepository.save(userToUpdate);
            return response.json(updatedUser);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating user", error });
        }
    }
}
