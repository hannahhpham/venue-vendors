import {IsEmail, IsString, IsNotEmpty, IsNumber, Contains, Length} from 'class-validator'

export class createVenueDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Contains('04')
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    suburb: string;

    @IsNotEmpty()
    @IsString()
    state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT" ;

    @IsNotEmpty()
    @Length(4)
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

    @IsString()
    suitability: string | null;
    
}