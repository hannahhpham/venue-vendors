import axios from "axios";
import { Venue } from "../types/venues";
import {User} from '../types/users'

//REFERENCES:
//FSD Lectorial 8 code archive
export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});


//api objects are made here for CRUD operations

//api for accessing the users table
export const userApi = {

    getAllUsers: async () => {
        const response = await api.get("users");
        return response.data;
    },

    getUserById: async (id: number) => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },

    //https://stackoverflow.com/questions/79196343/how-to-resolve-route-conflicts-in-express-js-with-similar-route-paths
    //NEED TO DISTINGUISH ROUTES SO THEY DONT CLASH
    getUserByEmail: async (email: string) => {
      const response = await api.get(`/users/login/${email}`);
      return response.data;
    },

    createUser: async (user: Partial<User>) => { //idk what Partial is but lab 8 had it
        const response = await api.post("/users", user);
        return response.data;
    },

    updateUser: async (id: number, user: Partial<User>) => {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    },
};

//other api objects

// api for accessing the venues table
export const venueAPI = {
  
  getAllVenues: async () => {
    const response = await api.get("/venues");
    return response.data;
  },

  getVenue: async (id: String) => {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  },

  // not sure a return is necessary
  getByVendor: async (id: string) => {
    const response = await api.get(`/users/${id}/venues`);
    return response.data;
  },

};