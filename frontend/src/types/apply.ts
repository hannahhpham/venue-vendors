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

// applications 7, 8, 9 descriptions (eg: event name, event description, notes) were generated
// via AI, complying with assignment requirements clarified in the discussion forum on Canvas.

export const applications: Application[] = [
    {
        id: 1,
        eventName: "Birthday Party",
        startTime: "12:00",
        endTime: "17:00",
        date: "2027-04-10",
        guests: 34,
        description: "A children's birthday party",
        notes: "",
        hirerID: 1,
        venueID: 1
    },

    {
        id: 2,
        eventName: "Easter Lunch",
        startTime: "11:00",
        endTime: "17:00",
        date: "2026-04-06",
        guests: 50,
        description: "A get together for all employees to come together, here keynote speeches and enjoy a feast!",
        isAccepted: true,
        notes: "Long duration. Plenty of people. Good way to showcase the restaurant as well and spread the word.",
        rank: 1,
        vendorRating: 5,
        hirerID: 1,
        venueID: 1
    },

    {
        id: 3,
        eventName: "RMIT Club Meeting",
        startTime: "12:00",
        endTime: "17:00",
        date: "2027-04-10",
        guests: 50,
        description: "A mid-semester General Meeting for all member of the club. This will be followed by a catered party so that members can unwind, network and enjoy!",
        notes: "",
        hirerID: 6,
        venueID: 1
    },

    {
        id: 4,
        eventName: "Tech Summit",
        startTime: "09:00",
        endTime: "17:00",
        date: "2027-04-10",
        guests: 50,
        description: "An event filled with keynote speakers from various tech organisations such as Telstra, the ASD and Commbank. Will include limited external catering, booths from different organisations and a networking area.",
        notes: "",
        rank: 1,
        hirerID: 7,
        venueID: 1
    },

    {
        id: 5,
        eventName: "Wedding",
        startTime: "08:00",
        endTime: "17:00",
        date: "2026-04-06",
        guests: 50,
        description: "A wedding for my cousins, will get catering from the in house restaurant. Want to make use of the beautiful rooftop views.",
        notes: "Long duration. Plenty of people. Good way to showcase the restaurant as well and possibly get promotional pics.",
        rank: 2,
        isAccepted: true,
        vendorRating: 5,
        hirerID: 6,
        venueID: 1
    },

    {
        id: 6,
        eventName: "50th Wedding Anniversary Ball & Lunch",
        startTime: "10:00",
        endTime: "17:00",
        date: "2026-04-10",
        guests: 50,
        isAccepted: false,
        description: "An anniversary celebration for my in-laws. Includes a grand ball and lunch at the restaurant.",
        notes: "",
        hirerID: 6,
        venueID: 1
    },

    {
        id: 7,
        eventName: "Charity Fundraiser Gala",
        startTime: "17:30",
        endTime: "23:00",
        date: "2027-05-20",
        guests: 120,
        description: "A formal evening event to raise funds for a local charity, including auctions, speeches, and dinner.",
        isAccepted: true,
        notes: "High guest count but well-organised. Great exposure for venue and potential repeat clients.",
        rank: 2,
        //no rating as this hasnt happened yet
        //vendorRating: 1,
        hirerID: 6,
        venueID: 8
    },
    {
        id: 8,
        eventName: "Engagement Party Dinner",
        startTime: "18:00",
        endTime: "22:30",
        date: "2026-01-12",
        guests: 40,
        description: "An intimate engagement celebration with family and friends, including a sit-down dinner and speeches.",
        isAccepted: true,
        notes: "Smaller group, easier logistics. Awaiting final confirmation from hirer.",
        rank: 3,
        vendorRating: 2,
        hirerID: 6,
        venueID: 9
    }, 
    {
        id: 9,
        eventName: "Birthday Dinner Celebration",
        startTime: "19:00",
        endTime: "23:00",
        date: "2027-06-02",
        guests: 25,
        description: "A private birthday dinner with close friends and family, featuring a customised menu and decorations.",
        notes: "",
        isAccepted: false,
        hirerID: 7,
        venueID: 7
    }
];