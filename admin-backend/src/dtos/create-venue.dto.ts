import {IsEmail, IsString, IsNotEmpty, IsOptional, 
        IsNumber, Contains, Length, Min, Max, Matches} from 'class-validator'

export class createVenueDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(10)
    @Matches(/^[0-9]{10}$/) //exactly 10 numbers
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
    @Min(1000)
    @Max(9999) //postcode needsto be 4 values. LENGTH DOESNT WORK ON NUMBERS
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

    @IsNotEmpty()
    @IsNumber()
    ownerID: number;

    @IsString()
    @IsOptional()
    suitability: string | null;
    
}