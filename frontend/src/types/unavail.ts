export type Unavailable = {
  id: number,
  startTime: string,                  // ALWAYS make times DOUBLE digit (e.g. 9 becomes 09) && 24 HR TIME (e.g. 7pm is 19:00)
  endTime: string,
  date: string,                       // ALWAYS make this YYYY-MM-DD
  venueID: number
};


export const blocked: Unavailable[] = [
    {
        id: 1,
        startTime: "05:00",
        endTime: "10:00",
        date: "2026-04-10",
        venueID: 1
    },

    {
        id: 2,
        startTime: "17:00",
        endTime: "19:00",
        date: "2026-04-06",
        venueID: 1
    },

    {
        id: 3,
        startTime: "10:00",
        endTime: "17:00",
        date: "2026-04-11",
        venueID: 1
    },

    {
        id: 4,
        startTime: "10:00",
        endTime: "17:00",
        date: "2026-04-12",
        venueID: 1
    },

    {
        id: 5,
        startTime: "10:00",
        endTime: "17:00",
        date: "2026-04-20",
        venueID: 1
    },
];