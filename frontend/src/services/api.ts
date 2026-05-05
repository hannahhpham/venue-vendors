import axios from "axios";

//REFERENCES:
//FSD Lectorial 8 code archive
export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

//declare types here for our API objects to use
export interface User {
  id: number
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone : string, 
  type: "hirer" | "vendor",
  //HIRER SPECIFIC
  reputation?: number,
  credibility?: number,
  ABN?: string
  license? : string,    // our base64 string - this is a jpg
  insurance? : string,      // our base64 string - this is a pdf
  registrationCert?: string,
  createdAt: Date,
};

//api objects are made here for CRUD operations

//api for accessing the users table
export const userApi = {

    getAllUsers: async () => {
        const response = await api.get("users");
        return response.data;
    },

    createUser: async (user: Partial<User>) => {
        const response = await api.post("/users", user);
        return response.data;
    },
};

//other api obkects