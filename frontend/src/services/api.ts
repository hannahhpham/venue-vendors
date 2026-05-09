import axios from "axios";
import { Venue } from "../types/venues";
import {User} from '../types/users'
import { Application } from "@/types/apply";

//REFERENCES:
//FSD Lectorial 8 code archive

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});


//api objects are made here for CRUD operations

//api for accessing the users table
export const userAPI = {

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

  getByVendor: async (vendorID: number) => {
    const response = await api.get(`/venues/users/${vendorID}`);
    return response.data;
  },

  createVenue: async (venue: Partial<Venue>) => {
    const response = await api.post("/venues", venue);
    return response.data;
  },

  updateVenue: async (venueID: number, venue: Partial<Venue>) => {
    const response = await api.put(`/venues/${venueID}`, venue);
    return response.data;
  },

  deleteVenue: async (venueID: number) => {
    const response = await api.delete(`/venues/${venueID}`);
    return response.data;
  },

};

// api for accessing the venues table
export const shortlistedVenueAPI = {
  
  getShortlistedVenues: async (hirerID: number) => {
    const response = await api.get(`/shortlistedVenues/${hirerID}`);
    return response.data;
  },

  shortlistVenue: async (hirerID: number) => {
    const response = await api.post(`/shortlistedVenues/${hirerID}`);
    return response.data;
  },

  updateRank: async (hirerID:number) => {
    const response = await api.put(`/shortlistedVenues/${hirerID}`);
    return response.data;
  },

  deleteShortlist: async (hirerID: number) => {
    const response = await api.delete(`/shortlistedVenues/${hirerID}`);
    return response.data;
  },


  
};

export const applicationAPI = {

  getAll: async () => {
    const response = await api.get("/applications");
    return response.data;
  },

  getVenueApps: async (venueID: number) => {
    const response = await api.get(`/applications/venues/${venueID}`);
    return response.data;
  },

  getHirerApps: async (hirerID : number) => {
    const response = await api.get(`/applications/hirers/${hirerID}`);
    return response.data;
  },

  getApp: async (appID : number) => {
    const response = await api.get(`/applications/${appID}`);
    return response.data;
  },

  createApp: async (app : Partial<Application>) => {
    const response = await api.post("/applications", app);
    return response.data;
  },

  updateApp: async (id : number, app : Partial<Application>) => {
    const response = await api.put(`/applications/${id}`, app);
    return response.data;
  },

  deleteApp: async (id : number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

};