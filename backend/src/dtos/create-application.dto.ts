import {IsEmail, IsString, IsNotEmpty, IsNumber, 
    Contains, Length, Min, max, IsOptional
} from 'class-validator'

export class createApplicationDto {

    @IsNotEmpty()
    @IsString()
    eventName: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;  
    
    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsNotEmpty()
    @IsString()
    date: string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    guests: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    abn?: string; // when the user is applying on behalf of a company

    @IsString()
    @IsOptional()
    file?: string; // file upload - Business Name Registration Certificate

    @IsNotEmpty()
    @IsNumber()
    hirerID: number;

    @IsNotEmpty()
    @IsNumber()
    venueID: number;
};
