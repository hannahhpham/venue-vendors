import {IsEmail, IsString, IsNotEmpty, IsNumber, Contains, Length,
        Min, Max, Matches
} from 'class-validator'

export class updateVenueDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    // cant get this working to include spaces
    @Matches(/^[0-9]{10}$/)
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    // @IsNotEmpty()
    // @IsString()
    // suburb: string;

    // @IsNotEmpty()
    // @IsString()
    // state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT" ;

    @IsNotEmpty()
    @Min(1000)
    @Max(9999)
    postcode: number;

    @IsNotEmpty()
    @IsNumber()
    capacity: number;

    @IsNotEmpty()
    @IsNumber()
    rate: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    //lets not do this cuz its complicated lol. woudl have to update venueDetails component
    // @IsString()
    // suitability: string | null;
    
}