-- note: none of these marked as accepted
INSERT INTO dbo.applications
    (
    eventName,
    startTime,
    endTime,
    date,
    guests,
    description,
    notes,
    hirerID,
    venueID
    )

VALUES

    (
        'Birthday Party',
        '12:00',
        '17:00',
        '2027-04-10',
        34,
        'A children''s birthday party',
        '',
        1,
        16
    ),

    (
        'Easter Lunch',
        '11:00',
        '17:00',
        '2026-04-06',
        50,
        'A get together for all employees to come together, here keynote speeches and enjoy a feast!',
        -- isAccepted: true
        'Long duration. Plenty of people. Good way to showcase the restaurant as well and spread the word.',
        -- rank: 1,
        -- vendorRating: 5,
        1,
        16
    ),

    (
        'RMIT Club Meeting',
        '12:00',
        '17:00',
        '2027-04-10',
        50,
        'A mid-semester General Meeting for all member of the club. This will be followed by a catered party so that members can unwind, network and enjoy!',
        '',
        6,
        16
    ),

    (
        'Tech Summit',
        '09:00',
        '17:00',
        '2027-04-10',
        50,
        'An event filled with keynote speakers from various tech organisations such as Telstra, the ASD and Commbank. Will include limited external catering, booths from different organisations and a networking area.',
        '',
        7,
        16
    ),

    (
        'Wedding',
        '08:00',
        '17:00',
        '2026-04-06',
        50,
        'A wedding for my cousins, will get catering from the in house restaurant. Want to make use of the beautiful rooftop views.',
        'Long duration. Plenty of people. Good way to showcase the restaurant as well and possibly get promotional pics.',
        6,
        16
    ),

    (
        '50th Wedding Anniversary Ball & Lunch',
        '10:00',
        '17:00',
        '2026-04-10',
        50,
        'An anniversary celebration for my in-laws. Includes a grand ball and lunch at the restaurant.',
        '',
        6,
        16
    ),

    (
        'Charity Fundraiser Gala',
        '17:30',
        '23:00',
        '2027-05-20',
        120,
        'A formal evening event to raise funds for a local charity, including auctions, speeches, and dinner.',
        'High guest count but well-organised. Great exposure for venue and potential repeat clients.',
        6,
        23
    ),

    (
        'Engagement Party Dinner',
        '18:00',
        '22:30',
        '2026-01-12',
        40,
        'An intimate engagement celebration with family and friends, including a sit-down dinner and speeches.',
        'Smaller group, easier logistics.',
        6,
        24
    ),
    (
        'Birthday Dinner Celebration',
        '19:00',
        '23:00',
        '2027-06-02',
        25,
        'A private birthday dinner with close friends and family, featuring a customised menu and decorations.',
        '',
        7,
        22
    )