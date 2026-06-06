-- i hope this doesn't randomly run

INSERT INTO dbo.users ([type], email, [password], phone, firstName, lastName)
VALUES
    (
        'hirer', 
        'hannah@gmail.com', 
        'password', 
        '0412345678',
        'Hannah', 
        'Pham'
    ),

    (
        'vendor',
        'ananya@gmail.com',
        'password',
        '0412345678',
        'Ananya',
        'Venkat'
    ),

    (
        'vendor',
        'jane@gmail.com',
        'password123',
        '0412345678',
        'Jane',
        'Doe'
    ),

    (
        'vendor',
        'claire@gmail.com',
        'password1234',
        '0412345678',
        'Claire',
        'Smith'
    ),

    (
        'vendor',
        'mel@gmail.com',
        'password12345',
        '0412345678',
        'Mel',
        'Bourne'
    ),

    (
        'hirer',
        'john@gmail.com',
        'password123456',
        '0412345678',
        'John',
        'Doe'
    ),

    (
        'hirer',
        'tim@gmail.com',
        'password1234567',
        '0412345678',
        'Tim',
        'Baker'
    )