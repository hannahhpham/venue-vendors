import {IsString, IsNotEmpty, IsNumber, Contains, Length, IsOptional} from 'class-validator'

//call these in the routes. 
//route.post(validateDto(CreateUserDTO), (req, res) => blah blah)
export class updateUserDTO {

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @Length(10)
    @Contains("04") //must have australian registered phone number
    phoneNumber: string;

    // shift into applications or no - double check w teachers
    @IsOptional()
    @IsString()
    abn: string;

    @IsOptional()
    @IsString()
    drivLic: string;

    @IsString()
    @IsOptional()
    insur: string;

    @IsString()
    @IsOptional()
    registrationCert: string;

    @IsNumber()
    reputation: number;

    @IsNumber()
    credibility: number;

}