export type Venue = {
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
  ownerID: number
};

// please note that (as per assignment specifications allow) venue information has been generated 
// via ai (so that we don't have to spend time making up information and spend more time coding!!)
export const venues: Venue[] = [
    //venues ananya added (1 and 2)
    {
        id: 1,
        name: "ABC Events Centre", 
        phone: "03 9240 1267",
        email: "events@abc.com",
        address: "23 Flinders Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: 3000,
        capacity: 50,
        rate: 50,
        stars: 5,
        description: `
            This beautiful venue is great for destination weddings in the heart of Melbourne city.
            Enjoy the picturesque views of the Yarra River flowing from the top floor of our high 
            rise venue. Take in the fresh air of the rooftop garden with displays curated by the 
            Royal Botanic Gardens. Experience the flavours of native Australia and from international 
            regions. 
            So book your destination wedding right here, at home in Melbourne!
            We look forward to serving you and your guests soon.
        `,
        ownerID: 2
    },

    {
        id: 2,
        name: "Kidz Partyland",
        phone: "03 9670 1222",
        email: "hello@kidzpartyland.com",
        address: "20 Sydney Road",
        suburb: "Burwood",
        state: "VIC",
        postcode: 3010,
        capacity: 150,
        rate: 75,
        stars: 3.5,
        description: `
            This is a great venue for hosting kids parties. We have playgrounds, activities 
            to keep kids of all ages entertained from laser tag, bowling to movies and in house 
            catering provided to parties, in the cost itself.

            But don't worry, parents don't miss out while kids are having fun. We have a dedicated 
            zone for parents, where you get your own catering!

            Why wait? Get in quick! Book your party today for an unforgettable experience!
        `,
        ownerID: 3
    },

    //venues hannah added in (3-10)
    {
        id: 3,
        name: "Harbour View Function Hall",
        phone: "03 9012 3456",
        email: "info@harbourview.com.au",
        address: "45 Docklands Drive",
        suburb: "Docklands",
        state: "VIC",
        postcode: 3008,
        capacity: 200,
        rate: 120,
        stars: 4.5,
        description: `
            Overlooking the Melbourne harbour, this spacious function hall is ideal for corporate events, 
            galas, and large private parties. Floor-to-ceiling windows provide natural light and stunning 
            waterfront views. On-site AV equipment and catering options available.
        `,
        ownerID: 2
    },
    {
        id: 4,
        name: "Garden Pavilion",
        phone: "03 9432 9988",
        email: "contact@gardenpavilion.com",
        address: "12 Elm Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: 3182,
        capacity: 80,
        rate: 90,
        stars: 4,
        description: `
            Nestled in beautiful gardens, the Garden Pavilion is perfect for weddings and small celebrations. 
            Guests can enjoy outdoor seating, floral arrangements, and a peaceful ambiance in the heart of 
            St Kilda. Catering packages available on request.
        `,
        ownerID: 3
    },
    {
        id: 5,
        name: "TechSpace Conference Centre",
        phone: "03 9650 1122",
        email: "hello@techspace.com.au",
        address: "88 Innovation Road",
        suburb: "Southbank",
        state: "VIC",
        postcode: 3006,
        capacity: 300,
        rate: 150,
        stars: 4.8,
        description: `
            The TechSpace Conference Centre caters to seminars, workshops, and corporate launches. 
            High-speed internet, modular seating, and professional AV equipment ensure a seamless experience.
        `,
        ownerID: 2
    },
    {
        id: 6,
        name: "Riverside Loft",
        phone: "03 9387 6677",
        email: "bookings@riversideloft.com.au",
        address: "7 Yarra Boulevard",
        suburb: "Richmond",
        state: "VIC",
        postcode: 3121,
        capacity: 60,
        rate: 80,
        stars: 4.2,
        description: `
            Riverside Loft offers a chic, industrial-style space ideal for private parties, small weddings, 
            and networking events. Overlooking the Yarra River, it offers a combination of modern design and 
            scenic views.
        `,
        ownerID: 4
    },
    {
        id: 7,
        name: "Sunset Beach Club",
        phone: "03 9770 4455",
        email: "info@sunsetbeachclub.com.au",
        address: "100 Beachside Ave",
        suburb: "Brighton",
        state: "VIC",
        postcode: 3186,
        capacity: 120,
        rate: 110,
        stars: 4.7,
        description: `
            Perfect for beachside weddings and summer events. Sunset Beach Club offers outdoor terraces, 
            private dining rooms, and catering services with fresh seafood specialties. Guests can enjoy 
            views of the bay.
        `,
        ownerID: 3
    },
    {
        id: 8,
        name: "City Skyline Rooftop",
        phone: "03 9045 3344",
        email: "events@cityskyline.com.au",
        address: "200 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: 3000,
        capacity: 100,
        rate: 130,
        stars: 4.9,
        description: `
            Take your event to new heights with City Skyline Rooftop. Ideal for cocktail parties, 
            corporate functions, and private celebrations. Enjoy panoramic views of Melbourne city 
            and premium catering packages.
        `,
        ownerID: 5
    },
    {
        id: 9,
        name: "Artisan Hall",
        phone: "03 9487 5566",
        email: "info@artisanhall.com.au",
        address: "55 Queen Street",
        suburb: "Fitzroy",
        state: "VIC",
        postcode: 3065,
        capacity: 70,
        rate: 85,
        stars: 4.3,
        description: `
            Artisan Hall is a boutique venue with a creative vibe, perfect for art exhibitions, 
            workshops, and small private gatherings. Enjoy the unique décor and flexible seating 
            arrangements.
        `,
        ownerID: 4
    },
    {
        id: 10,
        name: "Lakeside Pavilion",
        phone: "03 9876 2233",
        email: "bookings@lakesidepavilion.com.au",
        address: "30 Lakeview Drive",
        suburb: "Albert Park",
        state: "VIC",
        postcode: 3206,
        capacity: 180,
        rate: 125,
        stars: 4.6,
        description: `
            Located by the lake, this venue is ideal for weddings, receptions, and social gatherings. 
            Guests can enjoy outdoor spaces, scenic views, and professional catering services. 
            A perfect blend of elegance and nature.
        `,
        ownerID: 5
    }
];