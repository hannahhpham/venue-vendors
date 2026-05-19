import {IsEmail, IsString, IsNotEmpty, IsNumber, Contains, Length} from 'class-validator'

//THIS WONT WORK AHHHH


export class createBlockDTO {
    
    @IsNotEmpty()
    @IsString()
    startTime: string; 

    @IsNotEmpty()
    @IsString()
    endTime: string; 

    @IsNotEmpty()
    @IsString()
    date: Date;
}