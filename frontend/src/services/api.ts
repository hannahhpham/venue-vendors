import axios from "axios";
import { Venue } from "../types/venues";
import { User } from '../types/users'
import { Application } from "@/types/apply";
import { Unavailable } from "@/types/unavail";

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
    getUserByEmail: async (email: string, password: string) => {
      const response = await api.get(`/users/login/${email}`, {params: {password: password}});
      return response.data;
    },

    createUser: async (email: string, password: string, type: string,  //this used to be Partial<User> (lectorial 8)
                       firstName: string, lastName: string, phoneNumber: string) => {
        const response = await api.post("/users", {email, password, type, firstName, lastName, phoneNumber});
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

  getShortlistByRank: async (hirerID: number, rank: number) => {
    const response = await api.get(`/${rank}/shortlistedVenues/${hirerID}`, {data: {rank}});
    return response.data;
  },

  shortlistVenue: async (hirerID: number, venueID: number, rank: number) => {
    const response = await api.post(`/shortlistedVenues/${hirerID}`, {hirerID, venueID, rank}); //add it to the request body
    return response.data;
  },

  updateRank: async (hirerID:number, venueID: number, rank: number) => {
    const response = await api.put(`/shortlistedVenues/${hirerID}`, {hirerID, venueID, rank});
    return response.data;
  },

  deleteShortlist: async (hirerID: number, venueID: number) => {
    const response = await api.delete(`/shortlistedVenues/${hirerID}`, { data: {venueID} });
    return response.data;
  },


  
};


// api to access the applications table
export const applicationAPI = {

  getAllApps: async () => {
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

  getPastHirerApps: async (hirerID : number) => {
    const response = await api.get(`/applications/hirers/past/${hirerID}`);
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


// api to access the applications table
export const blockedAPI = {

  getAll: async () => {
    const response = await api.get("/unavailable");
    return response.data;
  },

  getVenueBlocked: async (venueID: number) => {
    const response = await api.get(`/unavailable/venues/${venueID}`);
    return response.data;
  },

  getOneBlocked: async (blockedID : number) => {
    const response = await api.get(`/unavailable/${blockedID}`);
    return response.data;
  },

  block: async (block : Partial<Unavailable>) => {
    const response = await api.post("/unavailable", block);
    return response.data;
  },

  updateBlock: async (id : number, block : Partial<Unavailable>) => {
    const response = await api.put(`/unavailable/${id}`, block);
    return response.data;
  },

  unblock: async (id : number) => {
    const response = await api.delete(`/unavailable/${id}`);
    return response.data;
  },

};