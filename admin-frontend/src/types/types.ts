//define the type returned by the api

//this has mostly been copied over from the types defined in the main frontend project
export type User = {
  id: number,
  type: "hirer" | "vendor",
  email?: string,
  firstName: string,
  lastName: string,
  phoneNumber? : string, //vendors dont really need to view this info at all? remove?
                        //hirers do tho! i think we make it optional

};

export interface Venue {
  id: number,
  name: string,
  phone: string,
  email: string,
  address: string,
  suburb: string,
  state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT",        //idk if this is just a victorian program - if it is, we can get rid of this
  postcode: number,
  capacity: number,
  rate: number,
  stars: number,
  description: string,
  suitability?: string,
  ownerID: number
};

export type Application = {
  id: number,
  eventName: string,
  startTime: string,                  // ALWAYS make times DOUBLE digit (e.g. 9 becomes 09) && 24 HR TIME (e.g. 7pm is 19:00)
  endTime: string,
  date: string,                       // ALWAYS make this YYYY-MM-DD
  guests: number,
  description: string,
  abn?: string,                         // when the user is applying on behalf of a company
  file?: string,                        // file upload - Business Name Registration Certificate
  isAccepted?: boolean,                  // i.e. if it has been approved by the vendor
  notes: string,
  vendorRating?: number,               // 0-5 stars ==> contributes to the reputation rating IF isAccepted === true
  rank?: number | undefined,
  hirerID: number,
  venueID: number
};

export type Unavailable = {
  id: number,
  startTime: string,                  // ALWAYS make times DOUBLE digit (e.g. 9 becomes 09) && 24 HR TIME (e.g. 7pm is 19:00)
  endTime: string,
  date: string,                       // ALWAYS make this YYYY-MM-DD
  venueID: number
};
